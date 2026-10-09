import { AngleMode } from '../types/calculator';

/**
 * Computes factorial of a non-negative integer.
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // Overflow in 64-bit float
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * Normalizes floating-point issues like 0.1 + 0.2 = 0.30000000000000004
 */
export function cleanFloat(num: number): number {
  if (Number.isNaN(num) || !Number.isFinite(num)) return num;
  // If extremely close to an integer:
  const rounded = Math.round(num);
  if (Math.abs(num - rounded) < 1e-12) return rounded;
  // Limit to 12 significant digits to avoid float precision artifact
  return parseFloat(num.toPrecision(12));
}

/**
 * Formats a number nicely for display.
 */
export function formatResult(val: number): string {
  if (Number.isNaN(val)) return 'Erro';
  if (!Number.isFinite(val)) return val > 0 ? '∞' : '-∞';

  const cleaned = cleanFloat(val);
  const absVal = Math.abs(cleaned);

  // If number is huge or tiny, use scientific notation
  if ((absVal >= 1e13 || (absVal < 1e-6 && absVal !== 0)) && absVal !== 0) {
    return cleaned.toExponential(6).replace('e+', 'e');
  }

  // Use localized format or clean string
  return cleaned.toString();
}

type TokenType = 'NUMBER' | 'OP' | 'FUNC' | 'LPAREN' | 'RPAREN' | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

const OPERATOR_PRECEDENCE: Record<string, { prec: number; assoc: 'L' | 'R' }> = {
  '+': { prec: 1, assoc: 'L' },
  '-': { prec: 1, assoc: 'L' },
  '*': { prec: 2, assoc: 'L' },
  '/': { prec: 2, assoc: 'L' },
  '%': { prec: 2, assoc: 'L' },
  '^': { prec: 3, assoc: 'R' },
};

const KNOWN_FUNCS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'sqrt', 'cbrt', 'ln', 'log', 'abs', 'fact', 'exp'
]);

/**
 * Tokenize a mathematical string expression
 */
function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `${Math.PI}`)
    .replace(/φ/g, `${(1 + Math.sqrt(5)) / 2}`)
    .trim();

  while (i < s.length) {
    const ch = s[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number (digits, decimal, or 'e' as Euler's constant if not scientific notation)
    if (/[0-9.]/.test(ch) || (ch === 'e' && (i + 1 >= s.length || !/[0-9]/.test(s[i + 1])) && (i === 0 || !/[0-9]/.test(s[i - 1])))) {
      if (ch === 'e') {
        tokens.push({ type: 'NUMBER', value: `${Math.E}` });
        i++;
        continue;
      }

      let numStr = '';
      while (i < s.length && (/[0-9.]/.test(s[i]) || (s[i] === 'e' && /[0-9+-]/.test(s[i + 1] || '')))) {
        numStr += s[i];
        if (s[i] === 'e' && (s[i + 1] === '+' || s[i + 1] === '-')) {
          i++;
          numStr += s[i];
        }
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Identifiers (function names or constants)
    if (/[a-zA-Z]/.test(ch)) {
      let ident = '';
      while (i < s.length && /[a-zA-Z]/.test(s[i])) {
        ident += s[i];
        i++;
      }
      if (ident === 'e') {
        tokens.push({ type: 'NUMBER', value: `${Math.E}` });
      } else if (ident === 'pi') {
        tokens.push({ type: 'NUMBER', value: `${Math.PI}` });
      } else if (KNOWN_FUNCS.has(ident)) {
        tokens.push({ type: 'FUNC', value: ident });
      } else {
        // Fallback: ignore or token as function
        tokens.push({ type: 'FUNC', value: ident });
      }
      continue;
    }

    if (ch === '(') {
      // Implicit multiplication like 2(3) or (2)(3)
      const prev = tokens[tokens.length - 1];
      if (prev && (prev.type === 'NUMBER' || prev.type === 'RPAREN')) {
        tokens.push({ type: 'OP', value: '*' });
      }
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    // Unary minus vs binary minus
    if (ch === '-' || ch === '+') {
      const prev = tokens[tokens.length - 1];
      const isUnary = !prev || prev.type === 'OP' || prev.type === 'LPAREN';
      if (isUnary) {
        if (ch === '-') {
          // Represent unary minus as 0 - ... or token with zero
          tokens.push({ type: 'NUMBER', value: '0' });
          tokens.push({ type: 'OP', value: '-' });
        }
        i++;
        continue;
      }
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^' || ch === '%') {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    if (ch === '!') {
      // Factorial operator treated as function invocation
      tokens.push({ type: 'FUNC', value: 'fact_postfix' });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

/**
 * Evaluates a mathematical expression safely using Shunting-Yard and RPN evaluation.
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): { result: number; error?: string } {
  if (!expr || !expr.trim()) return { result: 0 };

  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return { result: 0 };

    // Shunting-Yard algorithm
    const outputQueue: Token[] = [];
    const opStack: Token[] = [];

    for (const token of tokens) {
      if (token.type === 'NUMBER') {
        outputQueue.push(token);
      } else if (token.type === 'FUNC') {
        opStack.push(token);
      } else if (token.type === 'OP') {
        const o1 = token.value;
        const o1Info = OPERATOR_PRECEDENCE[o1] || { prec: 0, assoc: 'L' };

        while (opStack.length > 0) {
          const top = opStack[opStack.length - 1];
          if (top.type === 'FUNC') {
            outputQueue.push(opStack.pop()!);
            continue;
          }
          if (top.type === 'OP') {
            const o2 = top.value;
            const o2Info = OPERATOR_PRECEDENCE[o2] || { prec: 0, assoc: 'L' };
            if (
              (o1Info.assoc === 'L' && o1Info.prec <= o2Info.prec) ||
              (o1Info.assoc === 'R' && o1Info.prec < o2Info.prec)
            ) {
              outputQueue.push(opStack.pop()!);
              continue;
            }
          }
          break;
        }
        opStack.push(token);
      } else if (token.type === 'LPAREN') {
        opStack.push(token);
      } else if (token.type === 'RPAREN') {
        let foundLparen = false;
        while (opStack.length > 0) {
          const top = opStack.pop()!;
          if (top.type === 'LPAREN') {
            foundLparen = true;
            break;
          }
          outputQueue.push(top);
        }
        if (!foundLparen) {
          // Unbalanced parenthesis, silently handle
        }
        if (opStack.length > 0 && opStack[opStack.length - 1].type === 'FUNC') {
          outputQueue.push(opStack.pop()!);
        }
      }
    }

    while (opStack.length > 0) {
      const top = opStack.pop()!;
      if (top.type !== 'LPAREN' && top.type !== 'RPAREN') {
        outputQueue.push(top);
      }
    }

    // Evaluate RPN
    const evalStack: number[] = [];

    for (const token of outputQueue) {
      if (token.type === 'NUMBER') {
        const val = parseFloat(token.value);
        if (Number.isNaN(val)) return { result: NaN, error: 'Número inválido' };
        evalStack.push(val);
      } else if (token.type === 'OP') {
        if (evalStack.length < 2) {
          if (token.value === '-' && evalStack.length === 1) {
            evalStack.push(-evalStack.pop()!);
            continue;
          }
          return { result: NaN, error: 'Operador sem operandos' };
        }
        const b = evalStack.pop()!;
        const a = evalStack.pop()!;
        let res = 0;

        switch (token.value) {
          case '+':
            res = a + b;
            break;
          case '-':
            res = a - b;
            break;
          case '*':
            res = a * b;
            break;
          case '/':
            if (b === 0) return { result: NaN, error: 'Divisão por zero' };
            res = a / b;
            break;
          case '%':
            // Percentage: a % b is (a * b) / 100 in financial/calculator sense
            res = (a * b) / 100;
            break;
          case '^':
            res = Math.pow(a, b);
            break;
          default:
            return { result: NaN, error: 'Operador desconhecido' };
        }
        evalStack.push(res);
      } else if (token.type === 'FUNC') {
        if (token.value === 'fact_postfix' || token.value === 'fact') {
          if (evalStack.length < 1) return { result: NaN, error: 'Fatorial inválido' };
          const a = evalStack.pop()!;
          evalStack.push(factorial(Math.round(a)));
          continue;
        }

        if (evalStack.length < 1) return { result: NaN, error: 'Função sem argumento' };
        const a = evalStack.pop()!;
        let res = 0;

        // Angle conversions
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;

        switch (token.value) {
          case 'sin':
            res = Math.sin(angleMode === 'DEG' ? toRad(a) : a);
            break;
          case 'cos':
            res = Math.cos(angleMode === 'DEG' ? toRad(a) : a);
            break;
          case 'tan': {
            const rad = angleMode === 'DEG' ? toRad(a) : a;
            res = Math.tan(rad);
            break;
          }
          case 'asin': {
            const rad = Math.asin(a);
            res = angleMode === 'DEG' ? toDeg(rad) : rad;
            break;
          }
          case 'acos': {
            const rad = Math.acos(a);
            res = angleMode === 'DEG' ? toDeg(rad) : rad;
            break;
          }
          case 'atan': {
            const rad = Math.atan(a);
            res = angleMode === 'DEG' ? toDeg(rad) : rad;
            break;
          }
          case 'sinh':
            res = Math.sinh(a);
            break;
          case 'cosh':
            res = Math.cosh(a);
            break;
          case 'tanh':
            res = Math.tanh(a);
            break;
          case 'sqrt':
            if (a < 0) return { result: NaN, error: 'Raiz de número negativo' };
            res = Math.sqrt(a);
            break;
          case 'cbrt':
            res = Math.cbrt(a);
            break;
          case 'ln':
            if (a <= 0) return { result: NaN, error: 'Logaritmo natural <= 0' };
            res = Math.log(a);
            break;
          case 'log':
            if (a <= 0) return { result: NaN, error: 'Logaritmo <= 0' };
            res = Math.log10(a);
            break;
          case 'abs':
            res = Math.abs(a);
            break;
          case 'exp':
            res = Math.exp(a);
            break;
          default:
            return { result: NaN, error: `Função ${token.value} não suportada` };
        }
        evalStack.push(res);
      }
    }

    if (evalStack.length !== 1) {
      return { result: NaN, error: 'Expressão incompleta' };
    }

    const finalVal = cleanFloat(evalStack[0]);
    return { result: finalVal };
  } catch (err) {
    return { result: NaN, error: 'Erro de sintaxe' };
  }
}
