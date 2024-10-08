import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schema/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const mockBook = {
  title: 'Mock Book',
  author: 'Mock Author',
  publicationDate: '2023-01-01',
  genre: 'Mock Genre',
};

const mockBookModel = {
  create: jest.fn().mockImplementation((dto) => {
    return {
      ...dto,
      save: jest.fn().mockResolvedValue(mockBook),
    };
  }),

  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockBook]),
  }),
  
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockBook),
  }),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockBook),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockBook),
  }),
};

describe('BookService', () => {
  let service: BookService;
  let model: Model<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
        genre: 'Fiction',
        publicationDate: '2023-05-10',
      };
      const result = await service.create(createBookDto);
      const expectedBook = {
        ...createBookDto,
        save: expect.any(Function),
      };
      expect(result).toEqual(expectedBook);
      expect(model.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };
      const id = '60d5ec49f0d3e212f06b30bc';
      const result = await service.update(id, updateBookDto);
      expect(result).toEqual(mockBook);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, updateBookDto, { new: true });
    });
  });


  describe('delete', () => {
    it('should delete a book', async () => {
      const id = '60d5ec49f0d3e212f06b30bc';
      const result = await service.delete(id);
      expect(result).toEqual(mockBook);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
  describe('findAll', () => {
    it('should return an array of books', async () => {
      const paginationDto ={
        page: 1,
        limit: 10
      }
      const result = await service.findAll(paginationDto); 
      expect(result).toEqual([mockBook]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a book by id', async () => {
      const id = '60d5ec49f0d3e212f06b30bc';
      const result = await service.findById(id);
      expect(result).toEqual(mockBook);
      expect(model.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('findByAuthor', () => {
    it('should return books by author', async () => {
      const author = 'Mock Author';
      const result = await service.findByAuthor(author);
      expect(result).toEqual([mockBook]);
      expect(model.find).toHaveBeenCalledWith({ author });
    });
  });

  describe('findByGenre', () => {
    it('should return books by genre', async () => {
      const genre = 'Mock Genre';
      const result = await service.findByGenre(genre);
      expect(result).toEqual([mockBook]);
      expect(model.find).toHaveBeenCalledWith({ genre });
    });
  });

  describe('findByDate', () => {
    it('should return books by publication date', async () => {
      const date = '01-01-2023';
      const result = await service.findByDate(date);
      expect(result).toEqual([mockBook]);
      expect(model.find).toHaveBeenCalledWith({ publicationDate: '2023-01-01' });
    });
  });
});
