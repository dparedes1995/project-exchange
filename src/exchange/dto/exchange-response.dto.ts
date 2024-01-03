import { ApiProperty } from '@nestjs/swagger';

export class ExchangeResponseDto {
  @ApiProperty()
  readonly amount: number;
  @ApiProperty()
  readonly sourceCurrency: string;
  @ApiProperty()
  readonly targetCurrency: string;
  @ApiProperty()
  readonly convertedAmount: number;
  @ApiProperty()
  readonly rate: number;
}
