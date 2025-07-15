import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Exclude()
export class BookDTO {
  @Expose()
  @IsNumber()
  readonly id: number;
  @Expose()
  @IsNotEmpty({ message: 'Please Enter Full Name' })
  @IsString({ message: 'Please Enter Valid Name' })
  readonly bookName: string;
  @Expose()
  @IsNotEmpty({ message: 'Please Enter Full Name' })
  @IsString({ message: 'Please Enter Valid Name' })
  poster: string;
  @Expose()
  count: number;
  @Expose()
  publicDate: number;
  @Expose()
  description: string;
}