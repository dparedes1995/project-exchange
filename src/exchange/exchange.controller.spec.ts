import { ApiException } from 'src/exceptions/api-exception';
import { ExchangeDto } from './dto/exchange.dto';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let exchangeService: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: ExchangeService,
          useValue: {
            calculateExchangeRate: jest.fn(),
            createExchangeRate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    exchangeService = module.get<ExchangeService>(ExchangeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getExchangeRate', () => {
    it('should return the result of calculateExchangeRate', async () => {
      const exchangeDto: ExchangeDto = {
        amount: 123,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
      };
      const expectedResult = {
        amount: 123,
        convertedAmount: 104.55,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      jest
        .spyOn(exchangeService, 'calculateExchangeRate')
        .mockResolvedValue(expectedResult);

      expect(await controller.getExchangeRate(exchangeDto)).toBe(
        expectedResult,
      );
    });

    it('should throw an ApiException when calculateExchangeRate throws an error', async () => {
      const exchangeDto: ExchangeDto = {
        amount: 123,
        sourceCurrency: 'SD',
        targetCurrency: 'EUR',
      };
      const error = { status: 500, message: 'Error' };
      jest
        .spyOn(exchangeService, 'calculateExchangeRate')
        .mockRejectedValue(error);

      await expect(controller.getExchangeRate(exchangeDto)).rejects.toThrow(
        ApiException,
      );
    });
    it('should throw an ApiException with a custom message when an error occurs', async () => {
      const exchangeDto: ExchangeDto = {
        amount: 123,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
      };
      const error = new Error('Internal Server Error');
      jest
        .spyOn(exchangeService, 'calculateExchangeRate')
        .mockRejectedValue(error);

      try {
        await controller.getExchangeRate(exchangeDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ApiException);
        expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(e.message).toContain('[ExchangeController.getExchangeRate]');
      }
    });
  });
  describe('createExchangeRate', () => {
    it('should return the result of createExchangeRate', async () => {
      const exchangeDto: ExchangeDto = {
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      const expectedResult = {
        id: 1,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      jest
        .spyOn(exchangeService, 'createExchangeRate')
        .mockResolvedValue(expectedResult);

      expect(await controller.createExchangeRate(exchangeDto)).toBe(
        expectedResult,
      );
    });

    it('should throw an ApiException when createExchangeRate throws an error', async () => {
      const exchangeDto: ExchangeDto = {
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      const error = { status: 500, message: 'Error' };
      jest
        .spyOn(exchangeService, 'createExchangeRate')
        .mockRejectedValue(error);

      await expect(controller.createExchangeRate(exchangeDto)).rejects.toThrow(
        ApiException,
      );
    });

    it('should throw an ApiException with a custom message when an error occurs', async () => {
      const exchangeDto: ExchangeDto = {
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      const error = new Error('Internal Server Error');
      jest
        .spyOn(exchangeService, 'createExchangeRate')
        .mockRejectedValue(error);

      try {
        await controller.createExchangeRate(exchangeDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ApiException);
        expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(e.message).toContain('[ExchangeController.createExchangeRate]');
      }
    });
  });
});
