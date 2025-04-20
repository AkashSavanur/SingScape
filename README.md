# 2006-FDAC-S2

## ▶️ [Watch the demo video here](https://entuedu-my.sharepoint.com/:v:/g/personal/akash013_e_ntu_edu_sg/ET1GD7O-GMpPoWVVtm2DcWABijsNFzK8OOv3RP27fhXBPQ?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=Hzcnok)

# Lab 1 Deliverables
## Deliverables
• Documentation of functional and non-functional requirements• Data dictionary
• Initial Use Case Model, consisting of Use Case diagram and Use Case descriptions• UI Mockups
## Files
The Lab 1 Deliverables.pdf contains all the required lab 1 deliverables.
***

# Lab 2 Deliverables
## Deliverables
• Completed Use Case Diagram• Use Case Descriptions
• Class diagram of entity classes• Key boundary classes and control classes
• Sequence diagrams of some use cases• Initial Dialog map

## Files
The Lab 2 Deliverables.pdf contains all the required lab 2 deliverables.
The Lab2_diagrams.pdf contains all the diagrams required for Lab 2.
***

# Lab 3 Deliverables
## Deliverables
• Use Case Model • Design Model
• System Architecture • Application Skeleton
• Appendix

## Files
The Lab 3 Deliverables.pdf contains all the required lab 3 deliverables.
***

# Lab 4 Deliverables
## Deliverables
• Working Application Prototype • Source Code
• Test Cases and Testing Results 

## Files
The Lab 4 Deliverables.pdf contains all the required lab 4 deliverables.
***

## 📚 Table of Contents

- [SingScape](#singscape)
- [Setup Instructions](#setup-instructions)
  - [Frontend](#frontend)
  - [Backend](#backend)
    - [Database Configuration](#database-configuration)
- [Documentation](#documentation)
- [API Docs](#api-docs)
- [App Design](#app-design)
  - [Overview](#overview)
  - [Frontend](#frontend-1)
  - [Backend](#backend-1)
  - [Design Patterns](#design-patterns)
  - [SOLID Principles](#solid-principles)
  - [Tech Stack](#tech-stack)
- [External APIs](#external-apis)
- [Contributors](#contributors)

---
## SingScape

A Smart City Tourism Web Application that allows users to discover, book, and review attractions in Singapore. Includes admin management, partner onboarding, and public facility integration (e.g., nearby clinics, hawker centres, ATMs).

---

## Setup Instructions

### Frontend

```bash
cd Frontend
npm install
npm start
```
### Backend

### Database Configuration
- PostgreSQL used with Supabase
- Tables: Users, Attraction, Booking, Partners, Payment, Review, Ticket, Ticket_type

## API Docs

## App Design

### Overview
- Full Stack Web App with customer, admin, and partner roles
- Modular, scalable, and secure by design

### Frontend
- Built with React.js framework.
- Frontend consists of the user interfaces (pages), which are structured into different UI.
- Admin UI is placed separately.
- Assets contains images and animations used in the website.
- Components consists of reusable modules that are consistently used throughout the web site.


### Backend
- Built with Spring Boot framework
- Models (Entity): User.java, Booking.java, TicketType.java, Payment.java and Review.java are the Business Objects that represent the core data structure of SingScape.
- Service: The layer containing methods that accesses and modifies the Business Objects. UserService.java, PartnerService.java and BookingService.java are examples that provide core logic for interacting with entities.
- Repository: This layer handles specific operations such as Create, Read, Update and Delete (CRUD) by inheriting Spring Data JPA. Classes like TicketRepository.java, PartnerRepository.java and AttractionRepository.java are included.
- Controllers: This layer manages the REST API endpoints for client-backend communication. For example, TicketController.java, ExternalDataController.java and STBAttractionController.java are files that handle API paths and interaction logic.
- Security (Config): Contains files relevant to security and ensures login and API security using JWT Authentication. SecurityConfig.java and JwtAuthFilter.java are examples used in this layer.
- DTO (Data Transfer Object): This layer encompasses data transferable representations of entities used for API communication without having the internal entity structure exposed. TicketDTO.java, BookingDetailsDTO.java and PaymentRequest.java are examples.
- Enum: enumerated types are placed here which would be used across SingScape for defining constraints and improving type safety. Files like UserEnum.java and PaymentMethod.java are examples.
- Target: This layer contains every class that is constructed and compiled by Maven during the project building process. Examples like classes and test-classes.
- Resources: This module holds configuration files and external resources like application.properties. This defines settings that are environment-specific which includes database configuration and API keys.

### Design Patterns
#### Controllers (Facade Pattern):
Application of the Facade Pattern is when the controllers serve as "interfaces" for interacting
with the application's business logic, acting as entry points to the application. There are multiple
controllers, depending on the specific use case and/or role of the User.

- Auth Controller: This is an Authentication Controller. It lets Users login and sign up. It
has access to User entity.
- Admin Controller: This controller specifies the accessibility of different endpoints to
users of different roles (Admin/Non-Admin). It has access to the User entity.
- Attraction Controller: This is the controller for attractions. It allows viewing and
modification of attraction listings. It has access to the Attraction entity.
- User Controller: This is the controller that controls creation, modification and deletion
of user profiles. It has access to the User entity
- Payment Controller: This is the controller for Payments. It allows users to make
payments. It has access to the Payment entity.
- Request Controller: This controller handles booking requests prior to confirmation. It
has access to the Request entity.
- Booking Controller: This is the controller for bookings. It allows users to make and
view bookings. It has access to the Booking entity.
- Review Controller: This is the controller for reviews. It allows users to submit reviews
and access submitted reviews.
- Ticket Controller: This is the controller for tickets. It handles generation of tickets upon
successful booking. It has access to the Ticket entity.

#### Data Access Layer
To enable efficient data retrieval and data manipulation at the cost of scalability, the system
utilises an optimally designed Data Access Layer that hides database activity. Utilising the
Factory Pattern and the Strategy Pattern adds further to the modularity and flexibility and
extensibility of the architecture and therefore enables the addition of new data types without
modification to the fundamental logic.

- Factory Pattern: The Factory Pattern provides a framework to defer the process of creating objects so that
data-related objects can be dynamically instantiated at run time. Instead of explicitly instantiating
data-access objects, a factory class would take charge and produce the requisite object required
(for example, User, Booking, or Payment). This approach allows components to be separated
from one another and with the creation process from the business logic involved.
Strategy Pattern

- The Strategy Pattern allows different data-access methods to be chosen at runtime and hence
adds flexibility to the system with regard to changing storage and retrieval requirements. Instead
of hard coding CRUD (Create, Read, Update, Delete) operations in every entity, a data access
method interface is provided with dedicated implementations controlling operations based on
dedicated entities. This allows evolution without requiring changes to the existing code because
the inclusion of a new data management strategy becomes very simple.

#### Major Benefits
- Scalability – The system can handle increasing data operations without compromising
performance.
- Flexibility – New data access methods or storage mechanisms can be added without
modifying core logic.
- Maintainability - Isolates business logic from database management and hence clear and
well-structured code.
- By utilizing such design patterns, the Data Access Layer provides a solid foundation that ensures
effective and adaptable data management, hence enhancing consistency and scalability in the
application.

### SOLID Principles
S: Each module/component has a single responsibility
O: New features (e.g., review flagging) are added without modifying existing code
L: Components work well with each other via prop contracts
I: Interfaces are not bloated; backend endpoints are clearly scoped
D: Supabase decouples user logic from internal backend logic

### Tech Stack
| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React, Material UI          |
| Backend     | Springboot, Java            | 
| Auth        | Supabase Auth               |
| Database    | Supabase (PostgreSQL)       |
| Dev Tools   | VSCode, GitHub, Postman     |

### External API's
- Google Maps API – for redirection to location
- Data.gov.sg APIs – to retrieve:
  Nearby bus stops
  Hawker centre listings
  Medical facilities

### Contributors
- Dhaded Aditya Mahalingeshwar 
- Darren Jong Jet Ren
- Jacob Tong Wai Hong
- Savanur Akash
- Xu Junpeng









