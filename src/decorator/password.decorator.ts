import { registerDecorator, buildMessage } from 'class-validator';

export function IsStrongPassword(args: any = {}) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsStrongPassword',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: any) {
          return value.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$~!%*?^&])[A-Za-z\d@$~^!%*?&]{1,32}$/,
          );
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            args.message ||
            'Password should contain atleast 1 uppercase, 1 special character and upto 32 charcters.',
        ),
      },
    });
  };
}
