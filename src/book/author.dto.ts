import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Exclude()
export class AuthorDTO {
  @Expose()
  @IsNumber()
  readonly id: number;
  @Expose()
  @IsNotEmpty({ message: 'Please Enter Full Name' })
  @IsString({ message: 'Please Enter Valid Name' })
  readonly firstname: string;
  @Expose()
  @IsNotEmpty({ message: 'Please Enter Full Name' })
  @IsString({ message: 'Please Enter Valid Name' })
  readonly lastname: string;
  @Expose()
  @IsString({ message: 'Please Enter Valid Name' })
  readonly surname: string;
}