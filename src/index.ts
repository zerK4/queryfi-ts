import {
  AllowedOperators,
  ExtractRelations,
  OrderByInput,
  QueryBuilderOptions,
  RelationQueryModifier,
  SortableColumn,
  SortDirection,
} from './types';

class QueryBuilder<T extends Record<string, any>> {
  private basePath: string;
  private pathParams: Record<string, string | number> = {};
  private queryParams: Record<string, any> = {};
  private options: QueryBuilderOptions;

  private static defaultOptions: QueryBuilderOptions = {
    baseUrl: undefined,
    transformer: (params) => params,
    defaultPathParams: {},
  };

  constructor(basePath: string, options: QueryBuilderOptions = {}) {
    this.basePath = basePath;
    this.options = {
      transformer: (params) => params,
      ...options,
    };

    if (QueryBuilder.defaultOptions.defaultPathParams) {
      this.pathParams = { ...QueryBuilder.defaultOptions.defaultPathParams };
    }
  }

  /** Set default options for all QueryBuilder instances */
  static setDefaultOptions(options: QueryBuilderOptions): void {
    QueryBuilder.defaultOptions = {
      ...QueryBuilder.defaultOptions,
      ...Object.fromEntries(
        Object.entries(options).filter(([_, value]) => value !== undefined)
      ),
    };
  }

  /** Get current default options */
  static getDefaultOptions(): QueryBuilderOptions {
    return { ...QueryBuilder.defaultOptions };
  }

  /** Adds relations to be included in the query */
  with(relations: ExtractRelations<T> | ExtractRelations<T>[]): this {
    const relationString = Array.isArray(relations)
      ? relations.join(',')
      : String(relations);
    this.queryParams.with = relationString;
    return this;
  }

  /** Flexible where clause supporting multiple formats */
  private buildWhereConditions(
    conditions:
      | { [K in keyof T]?: T[K] }
      | Array<[keyof T, AllowedOperators, any]>,
    type: 'where' | 'orWhere'
  ): this {
    // If conditions are an object, handle simple key-value pairs
    if (typeof conditions === 'object' && !Array.isArray(conditions)) {
      Object.entries(conditions).forEach(([key, value]) => {
        this.queryParams[`${type}[${key}]`] = value;
      });
    }
    // If conditions are an array, handle more complex where clauses
    if (Array.isArray(conditions)) {
      conditions.forEach((condition) => {
        // @ts-expect-error FIXME: to be fixed
        if (condition.length === 2) {
          // @ts-expect-error FIXME: to be fixed
          this.queryParams[`${type}[${condition[0]}]`] = condition[1];
        } else if (condition.length === 3) {
          const isArray = Array.isArray(condition[2]);

          if (isArray) {
            // Handle array conditions
            // @ts-expect-error FIXME: to be fixed
            const key = `${type}[${condition[0]}][${condition[1]}]`;

            // Directly assign the entire array instead of individual iterations
            this.queryParams[key] = (condition[2] as []).join(',');
          } else {
            // @ts-expect-error FIXME: to be fixed
            const key = `${type}[${condition[0]}][${condition[1]}]`;
            this.queryParams[key] = condition[2];
          }
        }
      });
    }
    return this;
  }

  where(
    conditions:
      | { [K in keyof T]?: T[K] }
      | Array<[keyof T, AllowedOperators, any]>
  ): this {
    return this.buildWhereConditions(conditions, 'where');
  }

  orWhere(
    conditions:
      | { [K in keyof T]?: T[K] }
      | Array<[keyof T, AllowedOperators, any]>
  ): this | null {
    // Check if any where conditions exist
    const hasWhereConditions = Object.keys(this.queryParams).some((key) =>
      key.startsWith('where')
    );

    if (!hasWhereConditions) {
      return this.buildWhereConditions(conditions, 'where');
    }

    return this.buildWhereConditions(conditions, 'orWhere');
  }

  orderBy(
    column:
      | OrderByInput<T>
      | Partial<Record<SortableColumn<T>, SortDirection>>
      | OrderByInput<T>[],
    value?: SortDirection
  ): this {
    if (typeof column === 'string' && value) {
      this.queryParams[`orderBy[${column}]`] = value;
      return this;
    } else if (typeof column === 'string') {
      const [columnName, direction = 'asc'] = column.split(':');
      this.queryParams[`orderBy[${columnName}]`] = direction;
    }
    return this;
  }

  /** Adds limit to the query */
  limit(value: number): this {
    this.queryParams.limit = value;
    return this;
  }

  /** Adds a path parameter to the URL */
  path(key: string, value: string | number): this {
    this.pathParams[key] = value;
    return this;
  }

  /**
   * Apply query modifiers to a specific relation
   * @param relation The name of the relation to modify
   * @param modifiers The query modifiers to apply
   */
  queryRelation<R extends ExtractRelations<T>>(
    relation: R,
    modifiers: RelationQueryModifier<T>
  ): this {
    // Handle where clause
    if (modifiers.where) {
      const whereKey = `query_${String(relation)}[where]`;

      if (Array.isArray(modifiers.where)) {
        modifiers.where.forEach((condition) => {
          // @ts-expect-error FIXME: to be fixed
          if (condition.length === 2) {
            // @ts-expect-error FIXME: to be fixed
            this.queryParams[`${whereKey}[${condition[0]}]`] = condition[1];
          } else if (condition.length === 3) {
            // @ts-expect-error FIXME: to be fixed
            const operatorKey = `${whereKey}[${condition[0]}][${condition[1]}]`;
            this.queryParams[operatorKey] = condition[2];
          }
        });
      } else {
        Object.entries(modifiers.where).forEach(([key, value]) => {
          this.queryParams[`${whereKey}[${key}]`] = value;
        });
      }
    }

    // Handle orderBy
    if (modifiers.orderBy) {
      const orderByKey = `query_${String(relation)}[orderBy]`;

      if (Array.isArray(modifiers.orderBy)) {
        modifiers.orderBy.forEach((order, index) => {
          if (typeof order === 'string') {
            const [column, direction = 'asc'] = order.split(':');
            this.queryParams[`${orderByKey}[${index}]`] =
              `${column},${direction}`;
          } else if (Array.isArray(order)) {
            this.queryParams[`${orderByKey}[${index}]`] =
              `${order[0]},${order[1] || 'asc'}`;
          }
        });
      } else if (typeof modifiers.orderBy === 'string') {
        const [column, direction = 'asc'] = modifiers.orderBy.split(':');
        this.queryParams[`${orderByKey}`] = `${column},${direction}`;
      }
    }

    // Handle limit
    if (modifiers.limit !== undefined) {
      this.queryParams[`query_${String(relation)}[limit]`] = modifiers.limit;
    }

    // Handle select
    // if (modifiers.select) {
    //   const selectColumns = Array.isArray(modifiers.select)
    //     ? modifiers.select.join(',')
    //     : String(modifiers.select);
    //   this.queryParams[`query_${String(relation)}[select]`] = selectColumns;
    // }

    return this;
  }

  /** Select specific columns */
  select(columns: (keyof T)[] | keyof T): this {
    const selectColumns = Array.isArray(columns)
      ? columns.join(',')
      : String(columns);
    this.queryParams.select = selectColumns;
    return this;
  }

  /** Pagination support */
  /**
   * @param perPage The number of items per page
   * @param page The page number you want to get
   */
  paginate(perPage: number, page?: number): this {
    this.queryParams.paginate = perPage;
    if (page) {
      this.queryParams.page = page;
    }
    return this;
  }

  /**
   * @param page The page number you want to receive
   */
  page(page: number): this {
    if (!this.queryParams.page) {
      this.queryParams.page = page;
    }

    return this;
  }

  /**
   * `first` method will allow you to return
   * an object containing the data.
   *
   * Used with `Laravel` it should get only the
   *  first matching object from the queried model.
   */
  first(): string {
    this.queryParams.getter = 'first';

    return this.build();
  }

  /**
   * `get` method will allow you wo return
   *  an array of objects containing the matching data.
   *
   * Used with `Laravel` it should get an array with all
   *  the matching data from the queried model.
   */
  get(): string {
    this.queryParams.getter = 'get';

    return this.build();
  }

  count(): string {
    this.queryParams.action = 'count';

    return this.build();
  }

  /** Builds the final URL with all path and query parameters */
  build(): string {
    // Get the base URL from instance options or fall back to default options
    const baseUrl = this.options.baseUrl || QueryBuilder.defaultOptions.baseUrl;
    const url = baseUrl?.replace(/\/+$/, '') ?? '';
    let path = this.basePath;

    const allPathParams = {
      ...QueryBuilder.defaultOptions.defaultPathParams,
      ...this.pathParams,
    };

    // Replace path parameters
    for (const [key, value] of Object.entries(this.pathParams)) {
      path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
    }

    path = path.replace(/^\/+|\/+$/g, '');

    // Build full URL using the resolved base URL
    const fullUrl = url ? `${url}/${path}` : path;

    // Apply transformations
    const transformedParams = this.options.transformer
      ? this.options.transformer(this.queryParams)
      : this.queryParams;

    // Build query string
    const params = new URLSearchParams();
    Object.entries(transformedParams).forEach(([key, value]) => {
      if (
        Array.isArray(value) ||
        (typeof value === 'object' && value !== null)
      ) {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    });

    return params.toString() ? `${fullUrl}?${params.toString()}` : fullUrl;
  }
}

/**
 * Factory function for creating type-safe QueryBuilder instances
 * @template T The interface type describing the resource being queried
 */
function createQuery<T extends Record<string, any>>(
  basePath: string,
  options?: QueryBuilderOptions
): QueryBuilder<T> {
  return new QueryBuilder<T>(basePath, options);
}

export { createQuery, QueryBuilder };
