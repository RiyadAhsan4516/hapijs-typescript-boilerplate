import {object, ObjectSchema, string} from "joi";

namespace type_validation{

    export interface tokenFormat{
        id: number,
        type: string
    }

    export interface generatedTokens {
        accessToken: string,
        refreshToken: string
    }

    export interface loginInfo {
        email : string,
        password: string
    }

    export class loginInfoJoiValidation {
        public async check(obj: loginInfo) : Promise<any>{
            const schema : ObjectSchema = object({
                email: string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } })
                    .messages({
                        'string.base':"email should be of type string",
                        'string.email' : "email format is incorrect",
                        'string.required' : "email is not provided"
                    }),

                password: string()
                    .required()
                    .min(8)
                    .messages({
                        'string.base' : "password has to be a string",
                        'string.required' : "password is not provided",
                        'string.min' : "password minimum length is 8"
                    })
            })

            return schema.validate(obj, {abortEarly: false})
        }
    }
}

export {type_validation}
