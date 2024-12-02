type Prettify<T> = {
  [K in keyof T]: T[K]
} & {};

type VALID_RULS_RESULT<T> = [true, T, undefined]
type INVALID_RULS_RESULT = [false, unknown, string]
type RULE_RESULT<T> =  VALID_RULS_RESULT<T> | INVALID_RULS_RESULT;

type SUCESS_RESULT<T> = {
  valid: true,
  data: Prettify<{
    [K in keyof T]: T[K]
  }>
}
type FAILED_RESULT<T> = {
  valid: false,
  exception: Prettify<{
    [K in keyof T]: string[]
  }>,
}
type RESULT<T extends object> = SUCESS_RESULT<T> | FAILED_RESULT<T>

type Inputs<T> = {
  [K in keyof T]: RULE_RESULT<T[K]>
}

export class Rule {
  static string(i: any) {
    if(typeof i === "string" && i.length > 0) {
      return [true, i, undefined] as VALID_RULS_RESULT<string>;
    }
    return [false, i, "$ must be string"] as INVALID_RULS_RESULT;
  }

  static number(i: any, opt?: { min?: number, max?: number}) {
    if(typeof i !== "number" && isNaN(i as number)) {
      return [false, i, "$ must be number"] as INVALID_RULS_RESULT;
    }
    if(opt) {
      if(opt.min && i < opt.min) {
        return [false, i, "$ must be greater than " + opt.min] as INVALID_RULS_RESULT;
      }
      if(opt.max && i > opt.max) {
        return [false, i, "$ must be less than " + opt.max] as INVALID_RULS_RESULT;
      }
    }
    return [true, i, undefined] as VALID_RULS_RESULT<number>;
  }

  static boolean(i: any) {
    if(typeof i === "boolean") {
      return [true, i, undefined] as VALID_RULS_RESULT<boolean>;
    }
    return [false, i, "$ must be boolean"] as INVALID_RULS_RESULT;
  }

  static array(i: any, opt?: { minLength?: number, maxLength?: number }) {
    if(!Array.isArray(i)) {
      return [false, i, "$ must be array"] as INVALID_RULS_RESULT;
    }
    if(opt) {
      if(opt.minLength !== undefined && i.length < opt.minLength) {
        return [false, i, `$ length must be at least ${opt.minLength}`] as INVALID_RULS_RESULT;
      }
      if(opt.maxLength !== undefined && i.length > opt.maxLength) {
        return [false, i, `$ length must be at most ${opt.maxLength}`] as INVALID_RULS_RESULT;
      }
    }
    return [true, i, undefined] as VALID_RULS_RESULT<any[]>;
  }

  static email(i: any) {
    if(typeof i !== "string") {
      return [false, i, "$ must be string"] as INVALID_RULS_RESULT;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(i)) {
      return [false, i, "$ must be valid email address"] as INVALID_RULS_RESULT;
    }
    return [true, i, undefined] as VALID_RULS_RESULT<string>;
  }

  static object(i: any) {
    if(typeof i !== "object" || i === null || Array.isArray(i)) {
      return [false, i, "$ must be object"] as INVALID_RULS_RESULT;
    }
    return [true, i, undefined] as VALID_RULS_RESULT<object>;
  }

  static date(i: any) {
    const date = new Date(i);
    if(isNaN(date.getTime())) {
      return [false, i, "$ must be valid date"] as INVALID_RULS_RESULT;
    }
    return [true, date, undefined] as VALID_RULS_RESULT<Date>;
  }

  static password(i: any, opt?: {
    minLength?: number,
    maxLength?: number,
    requireUppercase?: boolean,
    requireLowercase?: boolean,
    requireNumbers?: boolean,
    requireSpecialChars?: boolean
  }) {
    if(typeof i !== "string") {
      return [false, i, "$ must be string"] as INVALID_RULS_RESULT;
    }

    const options = {
      minLength: 8,
      maxLength: 100,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      ...opt
    };

    if(i.length < options.minLength) {
      return [false, i, `$ must be at least ${options.minLength} characters`] as INVALID_RULS_RESULT;
    }
    if(i.length > options.maxLength) {
      return [false, i, `$ must be at most ${options.maxLength} characters`] as INVALID_RULS_RESULT;
    }
    if(options.requireUppercase && !/[A-Z]/.test(i)) {
      return [false, i, "$ must contain at least one uppercase letter"] as INVALID_RULS_RESULT;
    }
    if(options.requireLowercase && !/[a-z]/.test(i)) {
      return [false, i, "$ must contain at least one lowercase letter"] as INVALID_RULS_RESULT;
    }
    if(options.requireNumbers && !/\d/.test(i)) {
      return [false, i, "$ must contain at least one number"] as INVALID_RULS_RESULT;
    }
    if(options.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(i)) {
      return [false, i, "$ must contain at least one special character"] as INVALID_RULS_RESULT;
    }

    return [true, i, undefined] as VALID_RULS_RESULT<string>;
  }

  static regex(i: any, pattern: RegExp, errorMessage?: string) {
    if(typeof i !== "string") {
      return [false, i, "$ must be string"] as INVALID_RULS_RESULT;
    }
    if(!pattern.test(i)) {
      return [false, i, errorMessage || "$ does not match required pattern"] as INVALID_RULS_RESULT;
    }
    return [true, i, undefined] as VALID_RULS_RESULT<string>;
  }

  static dateBetween(i: any, opt: { start: Date | string, end: Date | string }) {
    const dateResult = Rule.date(i);
    if(!dateResult[0]) {
      return dateResult;
    }

    const date = dateResult[1];
    const start = new Date(opt.start);
    const end = new Date(opt.end);

    if(isNaN(start.getTime()) || isNaN(end.getTime())) {
      return [false, i, "Invalid start or end date provided"] as INVALID_RULS_RESULT;
    }

    if(date < start || date > end) {
      return [false, i, `$ must be between ${start.toISOString()} and ${end.toISOString()}`] as INVALID_RULS_RESULT;
    }

    return [true, date, undefined] as VALID_RULS_RESULT<Date>;
  }

  static file(i: any, opt?: {
    maxSizeInBytes?: number,
    allowedExtensions?: string[]
  }) {
    if(!(i instanceof File)) {
      return [false, i, "$ must be a File"] as INVALID_RULS_RESULT;
    }

    if(opt?.maxSizeInBytes && i.size > opt.maxSizeInBytes) {
      const maxSizeMB = opt.maxSizeInBytes / (1024 * 1024);
      return [false, i, `$ size must be less than ${maxSizeMB}MB`] as INVALID_RULS_RESULT;
    }

    if(opt?.allowedExtensions) {
      const ext = i.name.split('.').pop()?.toLowerCase();
      if(!ext || !opt.allowedExtensions.includes(ext)) {
        return [false, i, `$ must have one of these extensions: ${opt.allowedExtensions.join(', ')}`] as INVALID_RULS_RESULT;
      }
    }

    return [true, i, undefined] as VALID_RULS_RESULT<File>;
  }

  static url(i: any, opt?: { protocols?: string[] }) {
    if(typeof i !== "string") {
      return [false, i, "$ must be string"] as INVALID_RULS_RESULT;
    }

    try {
      const url = new URL(i);
      if(opt?.protocols && !opt.protocols.includes(url.protocol.replace(':', ''))) {
        return [false, i, `$ must use one of these protocols: ${opt.protocols.join(', ')}`] as INVALID_RULS_RESULT;
      }
      return [true, url, undefined] as VALID_RULS_RESULT<URL>;
    } catch {
      return [false, i, "$ must be a valid URL"] as INVALID_RULS_RESULT;
    }
  }

  static mime(i: any, allowedMimeTypes: string[]) {
    if(!(i instanceof File)) {
      return [false, i, "$ must be a File"] as INVALID_RULS_RESULT;
    }

    if(!allowedMimeTypes.includes(i.type)) {
      return [false, i, `$ must be one of these MIME types: ${allowedMimeTypes.join(', ')}`] as INVALID_RULS_RESULT;
    }

    return [true, i, undefined] as VALID_RULS_RESULT<File>;
  }

  static arrayIncludes<T>(i: any, items: T[]) {
    if(!Array.isArray(i)) {
      return [false, i, "$ must be array"] as INVALID_RULS_RESULT;
    }

    const missingItems = items.filter(item => !i.includes(item));
    if(missingItems.length > 0) {
      return [false, i, `$ must include all of these items: ${missingItems.join(', ')}`] as INVALID_RULS_RESULT;
    }

    return [true, i, undefined] as VALID_RULS_RESULT<T[]>;
  }

  static arrayOf(i: any, validator: (item: any) => RULE_RESULT<unknown>) {
    if(!Array.isArray(i)) {
      return [false, i, "$ must be array"] as INVALID_RULS_RESULT;
    }

    for(let index = 0; index < i.length; index++) {
      const result = validator(i[index]);
      if(!result[0]) {
        return [false, i, `Item at index ${index}: ${result[2]}`] as INVALID_RULS_RESULT;
      }
    }

    return [true, i, undefined] as VALID_RULS_RESULT<any[]>;
  }

  static hasProperties(i: any, properties: string[]) {
    if(typeof i !== "object" || i === null) {
      return [false, i, "$ must be object"] as INVALID_RULS_RESULT;
    }

    const missingProps = properties.filter(prop => !(prop in i));
    if(missingProps.length > 0) {
      return [false, i, `$ must have all of these properties: ${missingProps.join(', ')}`] as INVALID_RULS_RESULT;
    }

    return [true, i, undefined] as VALID_RULS_RESULT<object>;
  }

  static shape<T extends object>(i: any, shape: { [K in keyof T]: (value: unknown) => RULE_RESULT<unknown> }) {
    if(typeof i !== "object" || i === null) {
      return [false, i, "$ must be object"] as INVALID_RULS_RESULT;
    }

    const errors: string[] = [];
    for(const [key, validator] of Object.entries(shape)) {
      if(!(key in i)) {
        errors.push(`Missing required property: ${key}`);
        continue;
      }
      /** @ts-ignore */
      const result = validator(i[key]);
      if(!result[0]) {
        errors.push(`${key}: ${result[2]}`);
      }
    }

    if(errors.length > 0) {
      return [false, i, errors.join('; ')] as INVALID_RULS_RESULT;
    }

    return [true, i, undefined] as VALID_RULS_RESULT<T>;
  }
}

export class Doz<T extends object> {
  public result = {} as SUCESS_RESULT<T> | FAILED_RESULT<T>;
  constructor(input: Inputs<T>) {
    for(const [key, validation ] of Object.entries(input)) {
      const [valid, input, exception] = validation as RULE_RESULT<T[keyof T]>;
      this.result.valid = valid
      if(this.result.valid) {
        this.result.data = {
          ...this.result.data,
          [key]: input
        }
      }
      else {
        this.result.exception = {
          ...this.result.exception,
          [key]: exception?.replace("$", key)
        }
      }
    }
  }
}
