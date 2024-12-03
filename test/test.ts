import { Validate, Rule } from "../src/main.ts";
import { expect } from "jsr:@std/expect";

Deno.test("string test", () => {
    const validation = new Validate({
        name: Rule.string("John")
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            name: "John"
        }
    });
});

Deno.test("number test", () => {
    const validation = new Validate({
        age: Rule.number(25, { min: 0, max: 100 })
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            age: 25
        }
    });

    const invalidValidation = new Validate({
        age: Rule.number(150, { min: 0, max: 100 })
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            age: "age must be less than 100"
        }
    });
});

Deno.test("boolean test", () => {
    const validation = new Validate({
        isActive: Rule.boolean(true)
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            isActive: true
        }
    });
});

Deno.test("array test", () => {
    const validation = new Validate({
        tags: Rule.array(["one", "two"], { minLength: 1, maxLength: 3 })
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            tags: ["one", "two"]
        }
    });

    const invalidValidation = new Validate({
        tags: Rule.array(["one", "two", "three", "four"], { minLength: 1, maxLength: 3 })
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            tags: "tags length must be at most 3"
        }
    });
});

Deno.test("email test", () => {
    const validation = new Validate({
        email: Rule.email("test@example.com")
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            email: "test@example.com"
        }
    });

    const invalidValidation = new Validate({
        email: Rule.email("invalid-email")
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            email: "email must be valid email address"
        }
    });
});

Deno.test('object test', () => {
    const validation = new Validate({
        address: Rule.object({ street: "123 Main St", city: "Anytown", state: "CA", zip: "12345" }),
    });

    expect(validation.result).toEqual({
        valid: true,
        data: {
            address: {
                street: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345"
            }
        }
    });
});

Deno.test("date test", () => {
    const validation = new Validate({
        birthdate: Rule.date("2000-01-01")
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            birthdate: new Date("2000-01-01")
        }
    });

    const invalidValidation = new Validate({
        birthdate: Rule.date("invalid-date")
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            birthdate: "birthdate must be valid date"
        }
    });
});

Deno.test("password test", () => {
    const validation = new Validate({
        password: Rule.password("Test123!", {
            minLength: 6,
            maxLength: 20,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true
        })
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            password: "Test123!"
        }
    });

    const invalidValidation = new Validate({
        password: Rule.password("weak", {
            minLength: 6,
            requireUppercase: true
        })
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            password: "password must be at least 6 characters"
        }
    });
});

Deno.test("regex test", () => {
    const validation = new Validate({
        phone: Rule.regex("123-456-7890", /^\d{3}-\d{3}-\d{4}$/)
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            phone: "123-456-7890"
        }
    });

    const invalidValidation = new Validate({
        phone: Rule.regex("12345", /^\d{3}-\d{3}-\d{4}$/)
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            phone: "phone does not match required pattern"
        }
    });
});

Deno.test("dateBetween test", () => {
    const validation = new Validate({
        eventDate: Rule.dateBetween("2022-01-15", {
            start: "2022-01-01",
            end: "2022-12-31"
        })
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            eventDate: new Date("2022-01-15")
        }
    });

    const invalidValidation = new Validate({
        eventDate: Rule.dateBetween("2023-01-15", {
            start: "2022-01-01",
            end: "2022-12-31"
        })
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            eventDate: "eventDate must be between 2022-01-01T00:00:00.000Z and 2022-12-31T00:00:00.000Z"
        }
    });
});

Deno.test("url test", () => {
    const validation = new Validate({
        website: Rule.url("https://example.com", { protocols: ["https"] })
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            website: new URL("https://example.com")
        }
    });

    const invalidValidation = new Validate({
        website: Rule.url("ftp://example.com", { protocols: ["https"] })
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            website: "website must use one of these protocols: https"
        }
    });
});

Deno.test("arrayIncludes test", () => {
    const validation = new Validate({
        colors: Rule.arrayIncludes(["red", "blue", "green"], ["red", "blue"])
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            colors: ["red", "blue", "green"]
        }
    });

    const invalidValidation = new Validate({
        colors: Rule.arrayIncludes(["yellow", "orange"], ["red", "blue"])
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            colors: "colors must include all of these items: red, blue"
        }
    });
});

Deno.test("arrayOf test", () => {
    const validation = new Validate({
        numbers: Rule.arrayOf([1, 2, 3], Rule.number)
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            numbers: [1, 2, 3]
        }
    });

    const invalidValidation = new Validate({
        numbers: Rule.arrayOf([1, "2", 3], Rule.number)
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            numbers: "Item at index 1: numbers must be number"
        }
    });
});

Deno.test("hasProperties test", () => {
    const validation = new Validate({
        user: Rule.hasProperties({ name: "John", age: 25, email: "john@example.com" }, ["name", "email"])
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            user: { name: "John", age: 25, email: "john@example.com" }
        }
    });

    const invalidValidation = new Validate({
        user: Rule.hasProperties({ name: "John" }, ["name", "email"])
    });
    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            user: "user must have all of these properties: email"
        }
    });
});

Deno.test("shape test", () => {
    const validation = new Validate({
        user: Rule.shape({ name: "John", age: 25 }, {
            name: Rule.string,
            age: Rule.number
        })
    });
    expect(validation.result).toEqual({
        valid: true,
        data: {
            user: { name: "John", age: 25 }
        }
    });

    const invalidValidation = new Validate({
        user: Rule.shape({ name: '123', age: 25 }, {
            name: Rule.string,
            age: Rule.number
        })
    });
    expect(invalidValidation.result).toEqual({
        valid: true,
        data: {
            user: { name: "123", age: 25 }
        }
    });
});

Deno.test('instanceOf test', () => {
    class CustomDate extends Date {}
    const dateInstance = new CustomDate();
    const numberInstance = new Number(42);

    // Test valid Date instance
    const validation1 = new Validate({
        field: Rule.instanceOf(dateInstance, Date)
    });
    expect(validation1.result).toEqual({
        valid: true,
        data: {
            field: dateInstance
        }
    });

    // Test valid Number instance
    const validation2 = new Validate({
        field: Rule.instanceOf(numberInstance, Number)
    });
    expect(validation2.result).toEqual({
        valid: true,
        data: {
            field: numberInstance
        }
    });

    // Test invalid instance
    const validation3 = new Validate({
        field: Rule.instanceOf("42", Number)
    });
    expect(validation3.result).toEqual({
        valid: false,
        exception: {
            field: "field must be instance of Number"
        }
    });

    // Test multiple allowed instances
    const validation4 = new Validate({
        field: Rule.instanceOf(dateInstance, Date, CustomDate)
    });
    expect(validation4.result).toEqual({
        valid: true,
        data: {
            field: dateInstance
        }
    });
});

Deno.test('uuidv4 test', () => {
    // Test valid UUIDv4
    const validation1 = new Validate({
        field: Rule.uuidv4("123e4567-e89b-4d3c-8456-426614174000")
    });
    expect(validation1.result).toEqual({
        valid: true,
        data: {
            field: "123e4567-e89b-4d3c-8456-426614174000"
        }
    });

    // Test invalid version (v5)
    const validation2 = new Validate({
        field: Rule.uuidv4("123e4567-e89b-5d3c-8456-426614174000")
    });
    expect(validation2.result).toEqual({
        valid: false,
        exception: {
            field: "field must be a valid UUIDv4"
        }
    });

    // Test invalid format
    const validation3 = new Validate({
        field: Rule.uuidv4("not-a-uuid")
    });
    expect(validation3.result).toEqual({
        valid: false,
        exception: {
            field: "field must be a valid UUIDv4"
        }
    });

    // Test non-string input
    const validation4 = new Validate({
        field: Rule.uuidv4(123)
    });
    expect(validation4.result).toEqual({
        valid: false,
        exception: {
            field: "field must be string"
        }
    });
});

Deno.test("formData validation", () => {
    // Test valid form data
    const validForm = new FormData();
    validForm.append("name", "John Doe");
    validForm.append("age", "25");
    validForm.append("email", "john@example.com");

    interface UserForm {
        name: string;
        age: number;
        email: string;
    }

    const validValidation = new Validate({
        user: Rule.formData<UserForm>(validForm, {
            name: Rule.string,
            age: (value) => Rule.number(Number(value)),
            email: Rule.email
        })
    });

    expect(validValidation.result).toEqual({
        valid: true,
        data: {
            user: {
                name: "John Doe",
                age: 25,
                email: "john@example.com"
            }
        }
    });

    // Test invalid form data
    const invalidForm = new FormData();
    invalidForm.append("name", "");
    invalidForm.append("age", "not a number");
    invalidForm.append("email", "invalid-email");

    const invalidValidation = new Validate({
        user: Rule.formData<UserForm>(invalidForm, {
            name: Rule.string,
            age: (value) => Rule.number(Number(value)),
            email: Rule.email
        })
    });

    expect(invalidValidation.result).toEqual({
        valid: false,
        exception: {
            user: "name cannot be empty; age must be number; email must be valid email address"
        }
    });

    // Test missing fields
    const incompleteForm = new FormData();
    incompleteForm.append("name", "John Doe");
    // age and email are missing

    const incompleteValidation = new Validate({
        user: Rule.formData<UserForm>(incompleteForm, {
            name: Rule.string,
            age: Rule.number,
            email: Rule.email
        })
    });

    expect(incompleteValidation.result).toEqual({
        valid: false,
        exception: {
            user: "age must be number; email must be valid email address"
        }
    });

    // Test invalid FormData input
    const invalidInput = new Validate({
        user: Rule.formData<UserForm>({} as FormData, {
            name: Rule.string,
            age: (value) => Rule.number(Number(value)),
            email: Rule.email
        })
    });

    expect(invalidInput.result).toEqual({
        valid: false,
        exception: {
            user: "user must be FormData"
        }
    });
});
