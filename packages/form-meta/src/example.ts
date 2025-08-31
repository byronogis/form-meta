import { z } from 'zod'
import {
  // defineFieldsMeta,
  // resolveFieldsMeta,
  FieldsMeta,
} from './meta'

export const schema = z.object({
  name: z.object({
    first: z.string().default('John'),
    last: z.string().default('Doe'),
  }),
  age: z.number().default(18),
  links: z.array(z.object({
    urls: z.array(z.object({
      protocol: z.string().default('https'),
      host: z.string().default('example.com'),
    })),
    title: z.string().optional(),
  })).default([]).optional(),
})

type Schema = z.infer<typeof schema>

export const fieldsMeta = new FieldsMeta<
  // Schema,
  'input' | 'inputNumber',
  {
    disabled?: boolean
  }
>()

export const result = fieldsMeta.resolve({
  name: {
    nested: 'object',
    // initialValue: {
    //   first: 'John',
    //   last: 'Doe',
    // },
    subfields: {
      first: {
        name: 'first',
        type: 'input',
        // initialValue: 'John',
        // extends: {
        //   disabled: false,
        // } as const,
      },
      last: {
        name: 'last',
        type: 'input',
        // initialValue: 'Doe',
        // extends: {
        //   disabled: false,
        // } as const,
      },
    },
  },
  age: {
    name: 'age',
    type: 'inputNumber',
    // schema: schema.shape.age as any,
    initialValue: 18,
    extends: {
      disabled: false,
    } as const,
  },
  links: {
    name: 'links',
    // schema: schema.pick({ links: true }) as any,
    nested: 'array',
    // initialValue: [],
    subfields: {
      urls: {
        name: 'urls',
        nested: 'array' as const,
        subfields: {
          protocol: {
            name: 'protocol',
            type: 'input',
            // schema: schema.shape.links.unwrap().element.shape.url.shape.protocol as any,
            initialValue: 'https',
            extends: {
              disabled: false,
            } as const,
          },
          host: {
            name: 'host',
            type: 'input',
            initialValue: 'example.com',
            extends: {
              disabled: false,
            } as const,
          },
        },
      },
      title: {
        type: 'input',
      },
    },
  },
} satisfies Parameters<typeof fieldsMeta.resolve<Schema>>[0])

export const result2 = fieldsMeta.resolve({
  name: {
    nested: 'object',
    // initialValue: {
    //   first: 'John',
    //   last: 'Doe',
    // },
    subfields: {
      first: {
        name: 'first',
        type: 'input',
        // initialValue: 'John',
        // extends: {
        //   disabled: false,
        // } as const,
      },
      last: {
        name: 'last',
        type: 'input',
        // initialValue: 'Doe',
        // extends: {
        //   disabled: false,
        // } as const,
      },
    },
  },
  // age: {
  //   name: 'age',
  //   type: 'inputNumber',
  //   // schema: schema.shape.age as any,
  //   initialValue: 18,
  //   extends: {
  //     disabled: false,
  //   } as const,
  // },
  // links: {
  //   name: 'links',
  //   // schema: schema.pick({ links: true }) as any,
  //   nested: 'array',
  //   // initialValue: [],
  //   subfields: {
  //     urls: {
  //       name: 'urls',
  //       nested: 'array' as const,
  //       subfields: {
  //         protocol: {
  //           name: 'protocol',
  //           type: 'input',
  //           // schema: schema.shape.links.unwrap().element.shape.url.shape.protocol as any,
  //           initialValue: 'https',
  //           extends: {
  //             disabled: false,
  //           } as const,
  //         },
  //         host: {
  //           name: 'host',
  //           type: 'input',
  //           initialValue: 'example.com',
  //           extends: {
  //             disabled: false,
  //           } as const,
  //         },
  //       },
  //     },
  //     title: {
  //       type: 'input',
  //     },
  //   },
  // },
})['name.last']

export const age = fieldsMeta.resolve({
  name: {
    nested: 'object',
    // initialValue: {
    //   first: 'John',
    //   last: 'Doe',
    // },
    subfields: {
      first: {
        name: 'first',
        type: 'input',
        // initialValue: 'John',
        // extends: {
        //   disabled: false,
        // } as const,
      },
      last: {
        name: 'last',
        type: 'input',
        // initialValue: 'Doe',
        // extends: {
        //   disabled: false,
        // } as const,
      },
    },
  },
  age: {
    name: 'age',
    type: 'inputNumber',
    // schema: schema.shape.age as any,
    initialValue: 18,
    extends: {
      disabled: false,
    } as const,
  },
  links: {
    name: 'links',
    // schema: schema.pick({ links: true }) as any,
    nested: 'array',
    // initialValue: [],
    subfields: {
      urls: {
        name: 'urls',
        nested: 'array' as const,
        subfields: {
          protocol: {
            name: 'protocol',
            type: 'input',
            // schema: schema.shape.links.unwrap().element.shape.url.shape.protocol as any,
            initialValue: 'https',
            extends: {
              disabled: false,
            } as const,
          },
          host: {
            name: 'host',
            type: 'input',
            initialValue: 'example.com',
            extends: {
              disabled: false,
            } as const,
          },
        },
      },
      title: {
        type: 'input',
      },
    },
  },
}).age

export const links = fieldsMeta.resolve({
  name: {
    nested: 'object',
    // initialValue: {
    //   first: 'John',
    //   last: 'Doe',
    // },
    subfields: {
      first: {
        name: 'first',
        type: 'input',
        // initialValue: 'John',
        // extends: {
        //   disabled: false,
        // } as const,
      },
      last: {
        name: 'last',
        type: 'input',
        // initialValue: 'Doe',
        // extends: {
        //   disabled: false,
        // } as const,
      },
    },
  },
  age: {
    name: 'age',
    type: 'inputNumber',
    // schema: schema.shape.age as any,
    initialValue: 18,
    extends: {
      disabled: false,
    } as const,
  },
  links: {
    name: 'links',
    // schema: schema.pick({ links: true }) as any,
    nested: 'array',
    // initialValue: [],
    subfields: {
      urls: {
        name: 'urls',
        nested: 'array' as const,
        subfields: {
          protocol: {
            name: 'protocol',
            type: 'input',
            // schema: schema.shape.links.unwrap().element.shape.url.shape.protocol as any,
            initialValue: 'https',
            extends: {
              disabled: false,
            } as const,
          },
          host: {
            name: 'host',
            type: 'input',
            initialValue: 'example.com',
            extends: {
              disabled: false,
            } as const,
          },
        },
      },
      title: {
        type: 'input',
      },
    },
  },
}).links.subfields['links[number].urls'].subfields['links[number].urls[number].host']

console.dir({
  result,
}, {
  depth: Infinity,
})

// export class MyFieldsMeta<Data> extends FieldsMeta<any, any, any> {
//   //
//   constructor() {
//     super()
//   }
// }
