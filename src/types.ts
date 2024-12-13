import { z } from 'zod';

export type Primitive = string | number | boolean | null | undefined;

export type QueryParamValue =
  | Primitive
  | Record<string, Primitive>
  | Array<Primitive | Record<string, Primitive>>;

export type AllowedOperators =
  | '>'
  | '<'
  | '>='
  | '<='
  | '!='
  | '='
  | 'like'
  | 'not like'
  | 'whereIn'
  | 'whereNotIn'
  | 'whereBetween'
  | 'whereNotBetween';

export type SortDirection = 'asc' | 'desc';
export type SortableColumn<T> = keyof T & string;

export type OrderByInput<T> =
  | `${SortableColumn<T>}:${SortDirection}` // Template literal for "column:asc"
  | SortableColumn<T> // Single column "column"
  | [SortableColumn<T>, SortDirection]; // Tuple ["column", "asc"]

// Update the select type to be more flexible
export type SelectColumns<T> =
  | keyof ExtractRelations<T>
  | string[]
  | keyof T
  | string;

// Modify the RelationQueryModifier type
export type RelationQueryModifier<T> = {
  where?: Array<[keyof ExtractRelations<T>, AllowedOperators, any]>;
  orderBy?: OrderByInput<T> | OrderByInput<T>[];
  limit?: number;
  select?: SelectColumns<T>;
};

/**
 * Extracts relation keys from an interface, identifying object and object array properties.
 * @template T The interface type to extract relations from
 */
export type ExtractRelations<T> = {
  [K in keyof T]: T[K] extends object
    ? K
    : T[K] extends Array<infer U>
      ? U extends object
        ? K
        : never
      : T[K] extends object | undefined
        ? K
        : never;
}[keyof T];

// type QueryMethodName = "where" | "orderBy" | "limit" | "offset" | "select";

export type QueryBuilderOptions = {
  /**
   * Transform function to modify the final query parameters
   * Useful for adding custom logic or transformations
   */
  transformer?: (params: Record<string, any>) => Record<string, any>;

  /**
   * Provide a base url to be used for all queries
   */
  baseUrl?: string;

  /**
   * Validation schema for query parameters
   */
  validation?: z.ZodSchema;
};
