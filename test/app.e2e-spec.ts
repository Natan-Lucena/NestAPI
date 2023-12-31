import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './../src/prisma/prisma.service';
import { AuthDTO } from './../src/auth/dtos';
import { EditUserDTO } from 'src/user/dtos';
import { CreateBookMarkDTO, EditBookMarkDTO } from 'src/book-mark/dtos';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    jest.setTimeout(40000);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDTO = {
      email: 'zerinho@gmail.com',
      password: 'natanzinsenha',
    };
    describe('SignUp', () => {
      it('Should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should throw a exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw a exception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw a exception if there is no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
    });
    describe('SignIn', () => {
      it('Should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'token');
      });
      it('should throw a exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw a exception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw a exception if there is no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit current user', () => {
        const dto: EditUserDTO = {
          firstName: 'Natan',
          email: 'NatanLucena@Gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(dto)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe('Bookmarks', () => {
    describe('Get empty Bookmarks', () => {
      it('Should get a empty array of bookmarks', () => {
        return pactum
          .spec()
          .get('/book-mark')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmarks', () => {
      const dto: CreateBookMarkDTO = {
        title: 'First BookMark',
        link: 'www.google.com',
      };
      it('Should create a bookmark', () => {
        return pactum
          .spec()
          .post('/book-mark')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookMarkId', 'id');
      });
    });
    describe('Get Bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('/book-mark')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Edit BookMarks by id', () => {
      const dto: EditBookMarkDTO = {
        title: 'new title',
        description: 'New description',
      };
      it('Should edit bookmarks by id', () => {
        return pactum
          .spec()
          .patch('/book-mark/{id}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withPathParams('id', '$S{bookMarkId}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{bookMarkId}');
      });
    });
    describe('Get Bookmarks by id', () => {
      it('Should get bookmarks by id', () => {
        return pactum
          .spec()
          .get('/book-mark/$S{bookMarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectBodyContains('$S{bookMarkId}');
      });
    });
    describe('Delete Bookmarks by id', () => {
      it('Should delete bookmarks by id', () => {
        return pactum
          .spec()
          .delete('/book-mark/{id}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withPathParams('id', '$S{bookMarkId}')
          .expectStatus(204);
      });
      it('Should get a empty array of bookmarks', () => {
        return pactum
          .spec()
          .get('/book-mark')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
