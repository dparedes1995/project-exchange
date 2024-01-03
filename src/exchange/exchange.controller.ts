import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeDto } from './dto/exchange.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiException } from 'src/exceptions/api-exception';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('rate')
  @ApiOperation({ summary: 'Obtener tasa de cambio' })
  @ApiBody({ type: ExchangeDto })
  @ApiResponse({
    status: 200,
    description: 'Tasa de cambio obtenida con éxito',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getExchangeRate(@Body() exchangeDto: ExchangeDto) {
    try {
      return await this.exchangeService.calculateExchangeRate(exchangeDto);
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new ApiException(
        '[ExchangeController.getExchangeRate] : ' + error.message,
        status,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @ApiOperation({ summary: 'Crear tasa de cambio' })
  @ApiBody({ type: ExchangeDto })
  @ApiResponse({ status: 201, description: 'Tasa de cambio creada con éxito' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createExchangeRate(@Body() exchangeDto: ExchangeDto) {
    try {
      return await this.exchangeService.createExchangeRate(exchangeDto);
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new ApiException(
        '[ExchangeController.createExchangeRate] : ' + error.message,
        status,
      );
    }
  }
}
