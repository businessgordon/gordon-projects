# EPMS Entity Relationship Diagram

Entities:

- **User**
  - id (PK)
  - username
  - password_hash

- **Department**
  - departmentCode (PK)
  - departmentName
  - grossSalary
  - totalDeduction

- **Employee**
  - employeeNumber (PK)
  - firstName
  - lastName
  - position
  - address
  - telephone
  - gender
  - hiredDate
  - departmentCode (FK)

- **Salary**
  - salaryId (PK)
  - employeeNumber (FK)
  - departmentCode (FK)
  - grossSalary
  - totalDeduction
  - netSalary
  - month

Relationships:

- One Department has many Employees
- One Employee has many Salary records
- One Department has many Salary records

Cardinalities:

- Department (1) -> Employee (N)
- Employee (1) -> Salary (N)
- Department (1) -> Salary (N)
