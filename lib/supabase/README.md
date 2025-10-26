# Supabase TypeScript Types

## Generating Database Types

To get full type safety with your Supabase database, you need to generate TypeScript types from your database schema.

### Method 1: Using Supabase CLI (Recommended)

1. Install the Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:

   ```bash
   supabase login
   ```

3. Generate types from your remote database:

   ```bash
   supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
   ```

   Replace `YOUR_PROJECT_ID` with your actual Supabase project ID (found in your project settings).

### Method 2: Using npx (No Installation)

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
```

### Method 3: Using Local Development

If you're using local Supabase:

```bash
supabase gen types typescript --local > lib/supabase/database.types.ts
```

## Benefits

Once you generate the types, you'll get:

- ✅ Full autocomplete for table names, column names, and relationships
- ✅ Type checking for queries and mutations
- ✅ IntelliSense support in your IDE
- ✅ Compile-time error detection for database operations
- ✅ Full type safety in the `useInfiniteQuery` hook

## Current Setup

The `database.types.ts` file currently contains placeholder types based on your schema structure. Replace it with auto-generated types for complete type safety.

## Example

After generating types, your queries will be fully typed:

```typescript
// ✅ Fully typed - autocomplete works
const { data } = await supabase
  .from("job_positions") // ✅ Table name autocomplete
  .select("title, companies(name)"); // ✅ Column autocomplete

// ✅ TypeScript knows the exact shape of data
data.forEach((job) => {
  console.log(job.title); // ✅ Type-safe
  console.log(job.companies.name); // ✅ Type-safe
});
```

## Learn More

- [Supabase TypeScript Docs](https://supabase.com/docs/reference/javascript/typescript-support)
- [Generate Types Guide](https://supabase.com/docs/guides/api/rest/generating-types)
