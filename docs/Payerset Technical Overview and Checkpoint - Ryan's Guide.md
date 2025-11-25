# **Payerset Technical Overview and Checkpoint: Ryan's Guide**

This document summarizes the technical architecture, processes, and current challenges for the Payerset product line, primarily focusing on the **Rate Explorer**. It is designed to help non-technical team members (like Ryan) understand the landscape and identify critical checkpoints when engaging in creative product development and prototyping.

## **1\. The Data Challenge: Turning Noise into Gold**

The core of Payerset's value is taking extremely complex, high-volume healthcare data and making it useful.

* **The Problem:** Government mandates require providers to publish massive amounts of pricing data. However, this data is often a **"massive table of content files and machine-readable JSON"**—meaning it's disorganized, poorly structured, and requires lookups across **terabytes of files**. It is **not practical for humans to consume** directly.  
* **The Payerset Solution (Jerry's Process):** Jerry created a unique, high-scale process to ingest and **cleanse (rectify)** this data completely.  
  * **Data Ingestion:** This quarterly process involves parsing **trillions of rows of data**.  
  * **Processing Environment:** Currently, this intense processing is done **offline** using a dedicated server farm (thread rippers and mass drives), though it will likely move back to the cloud (AWS) eventually.  
  * **Resulting Data Format:** The cleansed and processed data is converted into **Parquet files** (an efficient columnar storage format) and stored in **Snowflake** (our main data warehouse).

## **2\. The Core Application Stack**

The Rate Explorer application is built to access and analyze the massive dataset stored in Snowflake.

| Component | Technology | Non-Technical Description |
| :---- | :---- | :---- |
| **Data Warehouse** | **Snowflake** | The central vault where all the massive, clean Payerset data is stored for analysis. |
| **Data Access** | **DuckDB** | A powerful in-memory analytical database used by the API to quickly query the Parquet files and load data into memory for fast user results. |
| **Front End (UI)** | **SolidJS & TypeScript** | The part of the application users interact with (what Speros is working on). |
| **Back End (API Orchestrator)** | **.NET (FastEndpoints)** | The core logic layer, rewritten by Adam for better **speed and efficiency** (twice as fast on a quarter of the resources). It handles user requests and fetches the correct data. |
| **Hosting Environment** | **AWS (Elastic Container Service \- ECS)** | The primary cloud platform that hosts the application, API, and UI. |
| **Metadata Store** | **Supabase** (Targeted for deprecation) | Currently stores things like user logins, analysis descriptions, and tracking events. **The goal is to move this data out of Supabase.** |
| **New SSO Provider** | **FusionAuth** | A new tool brought in to handle user login (**SSO**) and identity management, which is crucial for enterprise customers (like those needing Federated Identity Management). |

#### **🛠️ Key Data Flow for the Rate Explorer:**

1. A user runs an analysis in the **Rate Explorer UI**.  
2. The **API Orchestrator** receives the request.  
3. The API sends a command to **Snowflake**.  
4. Snowflake *writes* the resulting data directly to **Parquet files** in an **S3 bucket** (a storage service in AWS).  
5. The API then loads the necessary subset of data from **S3** into memory using **DuckDB** for quick delivery to the user.

## **3\. Current Technical Initiatives & Challenges**

Adam has been focusing heavily on improving stability, security, and future compliance. This is where most of the existing technical debt and risk lies.

#### **A. Architecture and Stability (DevSecOps)**

* **Infrastructure as Code (IaC):** Adam is using **CloudFormation** (AWS's IaC tool) to automate the deployment and management of **all AWS infrastructure** (VPCs, subnets, security rules, etc.). This ensures everything is **repeatable, auditable, and secure**, which is mandatory for compliance.  
* **Observability:** Implementing **Prometheus and Grafana** for logging, alerting, and monitoring to see how the APIs are performing.  
* **Scaling:** Prototyping a **distributed DuckDB worker service (in Rust)** to handle large queries (like the new Claims Explorer) better and manage costs.

#### **B. API Development**

* **Schema Externalization:** Adam created a system to define API schemas using external **JSON templates**. This makes it much faster and easier to create new API endpoints.  
* **MCP Server Wrapper:** A tool/API that allows programmatic generation and analysis of the Rate Explorer data, making it easier to integrate with other services (like Claude/AI).

#### **C. Compliance & Process (The Big Upcoming Push)**

Jerry is pushing for compliance certifications (SOC 2 Type 1, ISO, HIPAA).

* **SSO Migration Block:** The **MCP server** and all future enterprise-level login hinges on migrating the user authentication from **Supabase to FusionAuth**. This migration is Speros's next major task after shipping the Rate Explorer. **Deprecating Supabase** and moving its remaining metadata is a top priority.  
* **Compliance System of Record:** The team has agreed that **GitHub and AWS** will be the primary, controlled systems of record for compliance, while tools like Notion are used for creative planning and ideation.  
* **Version Control:** Adam externalized **all Snowflake stored procedures** and set up **CI/CD pipelines** to deploy them to separate Dev, QA, and Prod environments, ensuring changes are tracked and tested.

## **4\. Moving Forward: Best Practices Checkpoint**

As you and Jerry collaborate on creative prototypes (hackathons), use the questions below as a checkpoint to ensure your ideas are aligned with the new standards Adam is building, preventing them from becoming "a house of cards."

The goal is to move from prototype to production-ready design quickly.

### **🎯 Prototyping & Development Checkpoint**

| Area | The "Why" (Risk/Standard) | Key Questions to Ask |
| :---- | :---- | :---- |
| **Data Access** | Avoid putting strain on Snowflake or crashing the in-memory DuckDB processes with untuned queries. | **If this feature needs data, where should it come from?** (A new Snowflake procedure, an existing S3 Parquet file, or local DuckDB in the API?) |
| **Authentication** | The system must stop relying on Supabase and use FusionAuth for enterprise-level compliance and SSO. | **Does this new feature require a user login or identity management?** (If Yes, it MUST be built against the FusionAuth pattern, NOT Supabase.) |
| **API Pattern** | Leverage Adam's work on schema externalization to speed up development and keep API definitions organized. | **Can this new endpoint use the existing API Orchestrator framework?** (If so, Adam can likely implement it using the JSON schema model quickly.) |
| **Infrastructure** | All AWS resources (Dev, QA, Prod) must be repeatable and auditable for compliance (IaC). | **Does this require any new resources in AWS (databases, storage, networks)?** (If Yes, it MUST be provisioned using CloudFormation/IaC and not manually.) |
| **Deployment & Test** | Prevent crashing the single shared Dev environment that Speros and Jerry use for customer demos. | **Can this prototype be deployed to a dedicated, isolated sandbox environment?** (Request a separate, temporary Dev instance before going live to the main shared Dev/QA environments.) |
| **Logic Consistency** | Prevent conflicting logic between a new tool and the established Rate Explorer functionality. | **Can the MCP Wrapper be used to test/run this new analysis feature?** (If it’s a new analysis, it should be compatible with the MCP logic.) |
| **Code Documentation** | Maintain an auditable trail of all changes for compliance and team awareness. | **Did I create a change log entry (in the correct Markdown file folder) for this new feature?** |

