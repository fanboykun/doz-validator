import { Validate, Rule } from "../src/main.ts";
import { expect } from "jsr:@std/expect";

Deno.test("string test", () => {
    const validation = new Validate({
        name: Rule.string("Josh"),
    });
    
   expect(validation.result).toEqual({
    valid: true,
    data: {
      name: "Josh"
    }
  })
})

Deno.test('number test', () => {
  const validation = new Validate({
    age: Rule.number(17, { min: 0, max: 100 }),
  })

  expect(validation.result).toEqual({ 
    valid: true,
    data: {
      age: 17
    }
  })
})

Deno.test('boolean test', () => {
  const validation = new Validate({
    isAdmin: Rule.boolean(true),
  })

  expect(validation.result).toEqual({ 
    valid: true,
    data: {
      isAdmin: true
    }
  })
})
