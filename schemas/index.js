import z from "zod"




export const REGISTER_SCHEMA = z.object({
  name: z.string({required_error : "Name is required"})
         .min(2, "Name must be at least two character")
        .max(200, "Max %0 character")
        .trim(),
  email: z.string({required_error: "Email is required"})
           .email("Invalid email")  
           .toLowerCase() ,
  password: z.string({required_error: "Password is required"})   
             .min(6,"At least six character")   
             .regex(/[A-Z]/, "Must contain an uppercase")
             .regex(/[a-z]/, "Must contain a lowercase")
             .regex(/[0-9]/, "Must contain number")      
})         



export const LOGIN_SCHEMA = z.object({
 email: z.string({required_error: "Email is required"})
           .email("Invalid email")  
           .toLowerCase() ,
  password: z.string({required_error: "Password is required"})   
              
                        
}) 


export const TODO_SCHEMA = z.object({
    text: z.string({required_error : "Text is required"})
          .max(200,"Max 200 character")
          .min(1, "Task can not be empty"),
    completed: z.boolean().optional()      
})

export const UPDATE_SCHEMA = TODO_SCHEMA.partial()