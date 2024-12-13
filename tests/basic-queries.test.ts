import { createQuery } from '../src';

// Mock interface to represent a typical resource
interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  posts?: Post[];
}

interface Post {
  id: number;
  title: string;
}

describe('QueryBuilder Basic Functionality', () => {
  const baseUrl = '/users';

  test('should create a query with "with"', () => {
    const query = createQuery<User>(baseUrl).with('posts').build();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toBe('users?with=posts');
  });

  test('should create a query with select', () => {
    const query = createQuery<User>(baseUrl)
      .select(['email', 'id', 'status'])
      .build();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toBe('users?select=email,id,status');
  });

  test('should create a basic query with where clause', () => {
    const query = createQuery<User>(baseUrl).where({ status: 'active' }).get();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toBe('users?where[status]=active&getter=get');
  });

  test('should support complex where conditions', () => {
    const query = createQuery<User>(baseUrl)
      .where([
        ['id', '>', 10],
        ['name', 'like', '%John%'],
      ])
      .get();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toContain('where[id][>]=10');
    expect(decodedQuery).toContain('where[name][like]=%John%');
  });

  test('should support ordering', () => {
    const query = createQuery<User>(baseUrl).orderBy('name', 'desc').get();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toContain('orderBy[name]=desc');
  });

  test('should support limit', () => {
    const query = createQuery<User>(baseUrl).limit(10).get();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toContain('limit=10');
  });

  test('should support pagination', () => {
    const query = createQuery<User>(baseUrl).paginate(10, 2).get();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toContain('paginate=10');
    expect(decodedQuery).toContain('page=2');
  });

  test('should support path parameters', () => {
    const query = createQuery<User>('/users/{id}').path('id', 123).build();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toBe('users/123');
  });

  test('should append get method to the query', () => {
    const query = createQuery<User>('/users').get();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toBe('users?getter=get');
  });

  test('should append first method to the query', () => {
    const query = createQuery<User>('/users').first();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toBe('users?getter=first');
  });

  test('should build the query', () => {
    const query = createQuery<User>('/users')
      .select(['email'])
      .where({
        id: 1,
      })
      .build();

    const decodedQuery = decodeURIComponent(query);

    expect(decodedQuery).toBe('users?select=email&where[id]=1');
  });
});
