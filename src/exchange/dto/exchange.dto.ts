import { ApiProperty } from '@nestjs/swagger';

export class ExchangeDto {
  @ApiProperty()
  readonly amount?: number;
  @ApiProperty()
  readonly sourceCurrency: string;
  @ApiProperty()
  readonly targetCurrency: string;
  @ApiProperty()
  readonly rate?: number;
}
