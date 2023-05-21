# rocketship-ticket
## Real Estate Sensor Data Platform
### Focus: Backend 
### Project Start Date : 17 May 2023
### Completion Date: 21 May 2023


## Introduction

In this project, I implemented a backend service that can process and store real estate sensor data from multiple rooms and efficiently query and aggregated data over different time periods, measurement types, and resolutions.

## Description of the Problem
### Functional Requirements
    - We need an endpoint to store the sensor data, handling data coming in from sensors. We must handle data coming in from different time zones!
    
    - We need an endpoint to query data with parameters for start and end times, measurement type, room, and time resolution (raw, hourly, daily, weekly). Each parameter should be optional to provide for the user. (The default value for resolution is "raw"). If the resolution is not set to "raw," then we find the average value of all the values that fall within a time bucket of the chosen resolution. For example, if the hourly resolution is chosen, we average all the values that occur within a specific hour.

### NonFunctional Requirements
    - JSON format as in data.json must be used as a guideline for how the incoming data might be structured.
    
    - Queried data must be returned in JSON format.
    
    - ASSUMPTION: ISO8601 date format will be used as the format of Datetime field in the data.

## Solution Summary
Implemented REST API service has 3 endpoints with 2 main responsibilities.
-  /sensors with POST HTTP method is used to create resource
- /sensors/bulk with POST HTTP method is used to create multiple resources
- /sensors with GET HTTP method is used to read resources

If I had more time, I would use OpenAPI specification for describing the web service. Instead I am providing Postman collection for users to try it out.

## Technical Choices
We used following tools to build the system:

    - NodeJS with Typescript
    
        TypeScript adds additional syntax to JavaScript to support a tighter integration with your editor. Catch errors early in your editor.
        
    - TSDoc for documentation
    
        TSDoc is a proposal to standardize the doc comments used in TypeScript code, so that different tools can extract content without getting confused by each other's markup. The TSDoc notation looks pretty familiar:
        
    - MongoDB with Mongoose
    
        Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
        
    - Docker
    
        Docker takes away repetitive, mundane configuration tasks and is used throughout the development lifecycle for fast, easy and portable application development – desktop and cloud.
        
    - Studio 3T
    
        GUI for MongoDB

### Database Choice
Because I wanted to get more familiar with NoSQL Database Management Systems, I utilized MongoDB as the database for this project. I could also model the database using a Relational DBMS like PostgreSQL which I am more familiar.

    - Faster development speed compared to an SQL option:
    
        I was able to utilize MongoDB's document-oriented database feature to store JSON objects. It needs less pre-planning and pre-organization of data, and it’s easier to make modifications.
        
    - Scalability:
    
        Assumption: Volume of data is high.
        
        Consideration: SQL based options might slow down the system due to join operations during the data fetching, if we were to use Normalization while designing the database. Redundancy could be an option for this negative effect.
        
        Solution: NoSQL databases scale better horizontally by adding additional servers or nodes as needed to increase load.

### Software Portability
I utilized docker as a virtualization technology. It provides lightweight development environment without the overhead of virtual machines because it uses OS kernel to isolate resources with cgroups, namespaces, capabilities.

## Software Architecture
I followed a two `tiered` three `layered` approach for this system. 

Following text assumes `tier` and `layer` definitions as follows:
    
    A 'layer' refers to a functional division of the software, but a 'tier' refers to a functional division of the software that runs on infrastructure separate from the other divisions.

Chief benefit of three-tier architecture its logical and physical separation of functionality. Each tier can run on a separate operating system and server platform - e.g., web server, application server, database server - that best fits its functional requirements. (from IBM)

It also provides:

- Faster development

- Improved scalability

- Improved reliability

- Improved security


In our case:

- Data `tier`, where the information processed by the application is stored and managed using MongoDB runs on docker.

- Application `tier` runs on NodeJS

Decoupling application tier system into layers gives me ability to focus on single overall responsibility for each layer.

- Controller `layer` provides ability of communication between client `tier` and Service `layer`. I used this layer mostly for request validation, calling necessary functions of service layers, constructing response objects.

- Service `layer` provides ability of communication between controller `layer` and Data access `layer`. I used this layer business specific requirements.

- Data access `layer` provides ability of communication between service `layer` and Data `tier`. I used this layer for data access.

### Design of Main Algorithm
- Single resource creation is straight forward.
- Bulk resource creation is implemented for ease of testability but follows the same principle as sigle resource creation endpoint.

Resource fetching is as follows:

- Depending on the optional query parameters we build the complex query using builder pattern and use MongoDB `aggregate` method to fetch necessary data. We call this data as raw sensor data.
- If custom aggregation (e.g. hourly, daily, weekly) is wanted with measurement or room filter, we also do `group by` in our database query. This allow us to give grouping computation responsibility to data tier.
    - We construct the custom aggregation class and call necessary methods.
        - For an hourly aggregation request and room filter, we get following output
        
        ```
        [
            {
                "_id": {
                    "room": "Room B",
                    "measurement": "Humidity"
                },
                "values": [
                    {
                        "_id": "0",
                        "Datetime": "2022-08-28T18:00:00.000Z",
                        "Value": 18.7
                    }
                ]
            },
            {
                "_id": {
                    "room": "Room B",
                    "measurement": "Temperature"
                },
                "values": [
                    {
                        "_id": "0",
                        "Datetime": "2022-08-24T09:00:00.000Z",
                        "Value": 20.3
                    },
                    {
                        "_id": "1",
                        "Datetime": "2022-08-25T20:00:00.000Z",
                        "Value": 17.9
                    }
                ]
            }
        ]
        ```

### Design Patterns Used and Their Reasoning
#### **SOLID Design Patterns**
We used SOLID design patterns in various places throughout the code.

#### **S - Single-responsiblity Principle**
Each method is tried to be written as having a single responsiblity. Below patterns such as `builder` also forces us to think in this way. Each method in query builder has the single responsiblity of adding one parameter to the result query.
#### **O - Open-closed Principle**
For example, `CustomStrategy` is an `abstract class` with `getAggregateCustom` method that takes a callback to make the class  extendable without modifying the class itself.

#### **L - Liskov Substitution Principle**
From sensor.dao.ts:
```
    let builder: SensorQueryBuilder = new ConcreteSensorQueryBuilde(this.SensorData);
```
Liskov's notion of a behavioural subtype defines a notion of substitutability for objects; that is, if S is a subtype of T, then objects of type T in a program may be replaced with objects of type S without altering any of the desirable properties of that program. (from wikipedia)

#### **I - Interface Segregation Principle**
`SensorQueryBuilder` interface is seperated into various `contract` interfaces.

#### **D - Dependency Inversion Principle**
`SensorAggregationContext` depends on `Strategy` interface and not on a concrete strategy.

    Entities must depend on abstractions, not on concretions. It states that the high-level module must not depend on the low-level module, but they should depend on abstractions.


#### **Singleton Design Pattern (Creational)**
I used singleton design patterns thorughout the code to make sure a class has only single instance and we have global access to that instance.

One example of such resource is database connection: common/services/mongoose.service.ts

#### **Builder Design Pattern (Creational)**
I used builder design pattern while designing sensor query service. Since we have many optional parameters, constructed query might be very complex.

Using this pattern, we construct complex objects step by step and produce different types and representations of the object using the same construction code.

#### **Strategy Design Pattern (Behavioral)**
I used strategy design pattern while designing sensor aggregation service. This design pattern that lets us define a family of algorithms, put each of them into a separate class, and make their objects interchangeable.

In our case, we take a class that does something specific like aggregation in `three different ways` and extract all of these algorithms into separate classes called strategies.


### Trade-offs 
#### S - Single-responsiblity Principle
I though about seperating `calculateAverage` function into a seperate class or just a utility function. However, since we implement a small application, I didn't want to complicate the code further and put it inside most closely related CustomStrategy class.

#### Singleton Design Pattern
Singletons are hard to write unit tests due to class member variables that need resetting. We don't have many such class properties. We also consider tests will be run on development database that could be dropped.

We could use dependency injection and mock data for better testability. Spring framework is a good example for dependency injection.

## Left Out
- There is a weird bug which ValidatorJS accepts string of positive offset UTC date as a valid ISO8601 date string during POST request but does not consider it valid during GET request. I would investigate it more and probably open a Github issue, since similar validation errors seen in their regex previously: https://github.com/typestack/class-validator/issues/412

However, I was able to test multiple time zones through negative UTC offsets.

## What you might do differently if you were to spend additional time on the project?


As additional features
- Make responses more hypertext driven.
- Using seperate DTOs between each layer (controller, service, etc. for future extensibility of the system)
- Using OpenAPI specification
- Creating internal result type as a functionality by also using  a library feature like `vavr Either` of Java
- Securing endpoints
- Specify other references for this README

### references
- https://www.ibm.com/topics/three-tier-architecture
- https://en.wikipedia.org/wiki/ISO_8601