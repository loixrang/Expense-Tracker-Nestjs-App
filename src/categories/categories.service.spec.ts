import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service.js';
import { CategoriesRepository } from './categories.repository.js';
import { jest } from '@jest/globals';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockRepository = {
    findAll: jest.fn<CategoriesRepository['getCategories']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(CategoriesService);
  });

  it('should return categories belonging to a user', async () => {
    const categories: Awaited<ReturnType<CategoriesRepository['getCategories']>> = [
      {
        id: 1,
        userId: 35,
        name: 'Food',
        type: 'expense',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        userId: 35,
        name: 'Salary',
        type: 'income',
        createdAt: new Date().toISOString(),
      },
    ];

    mockRepository.findAll.mockResolvedValue(categories);

    const result = await service.getCategory(35);

    expect(result).toEqual(categories);
    expect(mockRepository.findAll).toHaveBeenCalledWith(35);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
