import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

export interface PaginatorQuery {
  page: number;
  orderBy?: string;
  where?: {
    [key: string]: any;
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async cleanDb() {
    await this.$transaction([this.system.deleteMany(), this.user.deleteMany()]);
  }

  async paginate<T>(model: any, query: PaginatorQuery, pathname: string) {
    try {
      const { page = 0, where } = query;

      const take = Number(this.config.get("APP_PAGE_SIZE", 10));
      const skip = page * take;
      const orderBy: {
        [key: string]: "asc" | "desc";
      } = {
        [query.orderBy?.replace("-", "") ?? "id"]: query.orderBy?.startsWith("-") ? "desc" : "asc",
      };

      const total = await model.count({ where });
      const totalPages = Math.ceil(total / take);

      const nextPageNumber = page < totalPages ? page + 1 : null;
      const previousPageNumber = page > 0 ? page - 1 : null;

      let nextPage = null;
      let previousPage = null;

      if (nextPageNumber) {
        const nextPageSearchParams = new URLSearchParams();
        nextPageNumber && nextPageSearchParams.set("page", nextPageNumber.toString());

        nextPage = `${pathname}?${nextPageSearchParams.toString()}`;
      }

      if (previousPageNumber) {
        const previousPageSearchParams = new URLSearchParams();
        previousPageNumber && previousPageSearchParams.set("page", previousPageNumber.toString());

        previousPage = `${pathname}?${previousPageSearchParams.toString()}`;
      }

      const data: T[] = await model.findMany({
        skip,
        take,
        orderBy,
        where,
      });

      return {
        next: nextPage,
        previous: previousPage,
        page: `${pathname}?page=${page.toString()}`,
        pages: totalPages,
        data,
        total,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException("Provided query is invalid");
      }
      throw e;
    }
  }
}
