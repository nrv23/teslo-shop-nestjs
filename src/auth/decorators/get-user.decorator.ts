import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

// usando este decorador puedo controlar y manipular la información que viene del request
export const GetUserDecorator = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        // data lo puedo usar para pasarle parametros al decorador
        console.log({data})
        const req = ctx.switchToHttp().getRequest(); // leer el request del contexto
        const user = req.user;

        if(!user) throw new InternalServerErrorException("user not found in request");
        return user;
    }
)