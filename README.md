# Description

In today's world, ORM's are popular and the de-facto standard for handling database entities. However, ORM's have the
nasty side effect of creating very inefficient queries depending on how you design your data model. Unnecessary joins,
over fetching, and transient fields are all risks that come with using an ORM.

I wanted something much simpler that was more of an in-between of an ORM and database stored procedures. A layer that
would allow me data access to the database with the flexibility to query the data how I need it rather than be
restricted to what my overall data model was.

Dalmart attempts to solve these issues while still giving one the power to query a database without having to define a
giant model schema that introduces you to the pitfalls of ORMs, while at the same time does not lock you into a database
vendor.
