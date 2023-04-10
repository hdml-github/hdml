with "frame" as (
  with "model" as (
    with
      "t1" as (
        select
          "table_catalog" as "catalog",
          "table_schema" as "schema",
          "table_name" as "table",
          "table_type" as "type"
        from
          "tenant_postgres"."information_schema"."tables"
      ),
      "t2" as (
        select 
          "table_catalog" as "catalog",
          "table_schema" as "schema",
          "table_name" as "table",
          "column_name" as "column",
          try_cast("ordinal_position" as integer) as "position",
          "column_default" as "default",
          "is_nullable" as "nullable",
          "data_type" as "type"
        from
          "tenant_postgres"."information_schema"."columns"
      )
      select
        "t1"."catalog" as "a.catalog",
        "t1"."schema" as "a.schema",
        "t1"."table" as "a.table",
        "t1"."type" as "a.type",
        "t2"."catalog" as "b.catalog",
        "t2"."schema" as "b.schema",
        "t2"."table" as "b.table",
        "t2"."column" as "b.column",
        "t2"."position" as "b.position",
        "t2"."default" as "b.default",
        "t2"."nullable" as "b.nullable",
        "t2"."type" as "b.type"
      from
        "t1", "t2"
  )
  select
    "a.catalog" as "catalog",
    "a.schema" as "schema",
    "a.table" as "table",
    "b.column" as "column"
  from
    "model"
  group by
    "a.catalog",
    "a.schema",
    "a.table",
    "b.column"
)
select
  "catalog",
  "schema",
  "table"
from
  "frame"
group by
  "catalog",
  "schema",
  "table"