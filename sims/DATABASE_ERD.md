# Database Entity Relationship Diagram (ERD)

## Diagram (Text Format)

```
┌─────────────────────┐
│      USERS          │
├─────────────────────┤
│ PK  userId (INT)    │
│ UQ  username (STR)  │
│     password (STR)  │
│     createdAt (TS)  │
└─────────────────────┘
          │
          │ 1..N
          │ (One user can have many stock out records)
          │
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SPARE_PART                                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ PK  sparePartId (INT)                                    │  │
│  │ UQ  name + category (STR)                                │  │
│  │     quantity (INT)                                       │  │
│  │     unitPrice (DECIMAL)                                  │  │
│  │     totalPrice (DECIMAL)                                 │  │
│  │     createdAt (TIMESTAMP)                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                     │                                            │
│          1          │         1                                 │
│         ││          │         ││                                │
│         ││          │         ││                                │
│     1..N││      1..N│     1..N││                                │
│         ││          │         ││                                │
│         ││          │         ││                                │
│         ││      ┌───┴─────────┘│                                │
│         │└──────┤              │                                │
│         │       │              │                                │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │    STOCK_IN          │  │    STOCK_OUT         │             │
│  ├──────────────────────┤  ├──────────────────────┤             │
│  │ PK  stockInId (INT)  │  │ PK  stockOutId (INT) │             │
│  │ FK  sparePartId (INT)├──┤ FK  sparePartId (INT)│             │
│  │     quantity (INT)   │  │ FK  userId (INT) ────┘             │
│  │     stockInDate      │  │     quantity (INT)                  │
│  │     createdAt (TS)   │  │     unitPrice (DEC)                 │
│  └──────────────────────┘  │     totalPrice (DEC)                │
│                            │     stockOutDate                    │
│                            │     createdAt (TS)                  │
│                            └──────────────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Relationships

### 1. USERS → STOCK_OUT
- **Cardinality**: One-to-Many (1:N)
- **Meaning**: One user can create many stock out records
- **Constraint**: Foreign Key userId in STOCK_OUT
- **Cascade**: ON DELETE CASCADE

### 2. SPARE_PART → STOCK_IN
- **Cardinality**: One-to-Many (1:N)
- **Meaning**: One spare part can have many stock in records
- **Constraint**: Foreign Key sparePartId in STOCK_IN
- **Cascade**: ON DELETE CASCADE

### 3. SPARE_PART → STOCK_OUT
- **Cardinality**: One-to-Many (1:N)
- **Meaning**: One spare part can have many stock out records
- **Constraint**: Foreign Key sparePartId in STOCK_OUT
- **Cascade**: ON DELETE CASCADE

## Table Details

### USERS Table
```
Column Name    | Data Type      | Constraints
---------------|----------------|------------------
userId         | INT            | PRIMARY KEY, AUTO_INCREMENT
username       | VARCHAR(100)   | UNIQUE, NOT NULL
password       | VARCHAR(255)   | NOT NULL
createdAt      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP

Indexes:
- PRIMARY KEY (userId)
- UNIQUE KEY (username)
```

### SPARE_PART Table
```
Column Name    | Data Type      | Constraints
---------------|----------------|------------------
sparePartId    | INT            | PRIMARY KEY, AUTO_INCREMENT
name           | VARCHAR(255)   | NOT NULL
category       | VARCHAR(100)   | NOT NULL
quantity       | INT            | DEFAULT 0
unitPrice      | DECIMAL(10,2)  | NOT NULL
totalPrice     | DECIMAL(15,2)  | DEFAULT 0
createdAt      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP

Indexes:
- PRIMARY KEY (sparePartId)
- UNIQUE KEY (name, category)
- INDEX (category)
```

### STOCK_IN Table
```
Column Name    | Data Type      | Constraints
---------------|----------------|------------------
stockInId      | INT            | PRIMARY KEY, AUTO_INCREMENT
sparePartId    | INT            | NOT NULL, FOREIGN KEY
stockInQuantity| INT            | NOT NULL
stockInDate    | DATE           | NOT NULL
createdAt      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP

Indexes:
- PRIMARY KEY (stockInId)
- FOREIGN KEY (sparePartId) → SPARE_PART(sparePartId)
- INDEX (sparePartId)
- INDEX (stockInDate)
```

### STOCK_OUT Table
```
Column Name      | Data Type      | Constraints
-----------------|----------------|------------------
stockOutId       | INT            | PRIMARY KEY, AUTO_INCREMENT
sparePartId      | INT            | NOT NULL, FOREIGN KEY
userId           | INT            | NOT NULL, FOREIGN KEY
stockOutQuantity | INT            | NOT NULL
stockOutUnitPrice| DECIMAL(10,2)  | NOT NULL
stockOutTotalPrice|DECIMAL(15,2)  | NOT NULL
stockOutDate     | DATE           | NOT NULL
createdAt        | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP

Indexes:
- PRIMARY KEY (stockOutId)
- FOREIGN KEY (sparePartId) → SPARE_PART(sparePartId)
- FOREIGN KEY (userId) → USERS(userId)
- INDEX (sparePartId)
- INDEX (userId)
- INDEX (stockOutDate)
```

## Relational Integrity

### Constraints Applied

1. **Primary Keys** - Ensure unique identification
2. **Foreign Keys** - Maintain referential integrity
3. **UNIQUE Constraints** - Prevent duplicate entries
4. **NOT NULL** - Ensure data completeness
5. **DEFAULT Values** - Provide sensible defaults
6. **CASCADE DELETE** - Clean up related records

### Data Flow

1. **Create Spare Part** → SPARE_PART table entry
2. **Add Stock In** → STOCK_IN record + Update SPARE_PART quantity (add)
3. **Add Stock Out** → STOCK_OUT record + Update SPARE_PART quantity (subtract)
4. **Delete Stock Out** → Remove STOCK_OUT + Reverse quantity update
5. **User Creation** → USERS table entry
6. **User Logout/Delete** → Session removed, cascade delete STOCK_OUT records

## Normalization

**Database Normalization Level: 3NF (Third Normal Form)**

- ✓ No repeating groups
- ✓ All non-key attributes depend on primary key
- ✓ No transitive dependencies
- ✓ Foreign key relationships properly defined
- ✓ Atomic values in all columns

## Performance Optimization

### Indexes Created
```sql
CREATE INDEX idx_spare_part_category ON spare_part(category);
CREATE INDEX idx_stock_in_sparepart ON stock_in(sparePartId);
CREATE INDEX idx_stock_in_date ON stock_in(stockInDate);
CREATE INDEX idx_stock_out_sparepart ON stock_out(sparePartId);
CREATE INDEX idx_stock_out_user ON stock_out(userId);
CREATE INDEX idx_stock_out_date ON stock_out(stockOutDate);
```

### Query Performance Tips
- Use indexes for filtering on sparePartId, userId, and dates
- Join queries benefit from proper indexing
- Aggregate queries should filter by date for better performance

## Sample Data Relationships

```
User: admin (userId=1)
│
├─→ Stock Out Record 1
│   └─→ Spare Part: Engine Oil Filter (sparePartId=1)
│       └─→ Stock In Record 1
│           └─ Added 100 units
│       └─→ Stock In Record 2
│           └─ Added 50 units
│       └─→ Stock Out Record 1
│           └─ Removed 10 units (by admin)
│
└─→ Stock Out Record 2
    └─→ Spare Part: Air Filter (sparePartId=2)
        └─→ Stock In Record 3
            └─ Added 80 units
        └─→ Stock Out Record 2
            └─ Removed 5 units (by admin)
```

## SQL Examples

### Get Current Stock Status
```sql
SELECT 
  sp.name,
  sp.category,
  sp.quantity as current_quantity,
  SUM(CASE WHEN si.stockInId IS NOT NULL THEN si.stockInQuantity ELSE 0 END) as total_in,
  SUM(CASE WHEN so.stockOutId IS NOT NULL THEN so.stockOutQuantity ELSE 0 END) as total_out
FROM spare_part sp
LEFT JOIN stock_in si ON sp.sparePartId = si.sparePartId
LEFT JOIN stock_out so ON sp.sparePartId = so.sparePartId
GROUP BY sp.sparePartId;
```

### Get User's Stock Out Activities
```sql
SELECT 
  u.username,
  so.stockOutDate,
  sp.name,
  so.stockOutQuantity,
  so.stockOutTotalPrice
FROM users u
JOIN stock_out so ON u.userId = so.userId
JOIN spare_part sp ON so.sparePartId = sp.sparePartId
ORDER BY so.stockOutDate DESC;
```

### Low Stock Alert
```sql
SELECT 
  sp.name,
  sp.category,
  sp.quantity,
  sp.unitPrice
FROM spare_part sp
WHERE sp.quantity < 20
ORDER BY sp.quantity ASC;
```
