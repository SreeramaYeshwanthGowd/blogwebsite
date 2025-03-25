# CI/CD for ML Systems: Versioning Datasets and Models with Databricks Workflows

In the rapidly evolving field of machine learning (ML), organizations face significant challenges in consistently delivering ML models to production while maintaining quality, reproducibility, and governance. Continuous Integration and Continuous Deployment (CI/CD) practices, which have transformed traditional software development, are now being adapted for ML systems to address these challenges. This article explores how to implement effective CI/CD practices for ML systems, with a particular focus on versioning datasets and models using Databricks workflows.

## The Unique Challenges of ML Systems

While traditional software CI/CD focuses primarily on code, ML systems introduce additional complexities that require specialized approaches.

### Beyond Code: The ML Artifact Triad

In traditional software development, the primary artifact is code. However, ML systems involve three interdependent components:

1. **Code**: Model architecture, training scripts, preprocessing logic
2. **Data**: Training datasets, validation datasets, test datasets
3. **Models**: Trained model artifacts with specific parameters and weights

Changes to any of these components can affect system behavior, requiring all three to be versioned, tracked, and tested together.

### Key Concept: ML Technical Debt

ML systems accumulate technical debt in unique ways beyond traditional software. Without proper CI/CD practices, organizations face:

- **Hidden feedback loops**: Changes in production data affecting future model training
- **Entanglement**: Tight coupling between components making changes risky
- **Undeclared consumers**: Unknown systems depending on model outputs
- **Data dependencies**: Reliance on external data sources that may change
- **Experimental code paths**: Research code that makes it to production without proper engineering

Implementing CI/CD for ML systems helps manage this technical debt by enforcing discipline, reproducibility, and governance.

## Core Principles of CI/CD for ML Systems

Effective CI/CD for ML systems builds on traditional software practices while addressing ML-specific requirements.

### Continuous Integration for ML

CI for ML extends beyond code integration to include:

1. **Data validation**: Ensuring data quality and schema consistency
2. **Feature validation**: Verifying feature distributions and relationships
3. **Model validation**: Testing model performance against benchmarks
4. **Integration testing**: Validating the entire ML pipeline

### Continuous Delivery/Deployment for ML

CD for ML focuses on reliably delivering models to production:

1. **Model packaging**: Standardizing model artifacts for deployment
2. **Environment consistency**: Ensuring runtime compatibility
3. **Deployment strategies**: Implementing canary releases, shadow deployments
4. **Monitoring setup**: Configuring observability for deployed models

### Reproducibility as a Foundation

At the core of ML CI/CD is reproducibility—the ability to recreate any model from its inputs:

1. **Deterministic pipelines**: Ensuring consistent results from the same inputs
2. **Environment isolation**: Controlling dependencies and runtime environments
3. **Artifact versioning**: Tracking all components that influence model behavior
4. **Experiment tracking**: Recording hyperparameters and training metrics

## Versioning Strategies for ML Artifacts

Effective versioning is the foundation of ML CI/CD, enabling reproducibility, rollbacks, and governance.

### Code Versioning Best Practices

While code versioning leverages standard Git practices, ML systems benefit from:

1. **Configuration as code**: Storing hyperparameters and pipeline configurations in version control
2. **Pipeline modularity**: Designing components with clear interfaces for easier versioning
3. **Testing automation**: Including data and model validation tests in repositories
4. **Documentation**: Maintaining clear documentation of model architecture and assumptions

### Data Versioning Approaches

Data versioning presents unique challenges due to size and complexity:

1. **Metadata tracking**: Recording dataset characteristics and provenance
2. **Immutable datasets**: Treating datasets as immutable snapshots
3. **Delta versioning**: Storing changes rather than full copies when possible
4. **Feature stores**: Using specialized systems to version features

### Model Versioning Strategies

Model versioning requires tracking both artifacts and their creation context:

1. **Artifact storage**: Preserving model binaries with unique identifiers
2. **Lineage tracking**: Recording the complete provenance of each model
3. **Parameter versioning**: Storing hyperparameters and configuration
4. **Performance metadata**: Associating quality metrics with each version

## Databricks Workflows for ML CI/CD

Databricks provides a comprehensive platform for implementing CI/CD workflows for ML systems, with specialized tools for versioning datasets and models.

### Databricks Workspace Architecture

The Databricks workspace provides an integrated environment for ML development and deployment:

1. **Notebooks**: Interactive development environments for experimentation
2. **Jobs**: Scheduled or triggered execution of notebooks or scripts
3. **Workflows**: Orchestrated sequences of tasks with dependencies
4. **MLflow**: Tracking, registry, and deployment of ML artifacts
5. **Delta Lake**: Versioned data storage with ACID transactions

### Delta Lake for Dataset Versioning

Delta Lake provides powerful capabilities for dataset versioning:

#### Time Travel and Snapshot Isolation

Delta Lake maintains a transaction log that enables accessing previous versions of datasets:

```python
# Read the current version of a dataset
current_data = spark.read.format("delta").load("/path/to/delta-table")

# Read a specific version of a dataset
historical_data = spark.read.format("delta").option("versionAsOf", 5).load("/path/to/delta-table")

# Read a dataset as of a specific timestamp
point_in_time_data = spark.read.format("delta").option("timestampAsOf", "2023-01-15T00:00:00.000Z").load("/path/to/delta-table")
```

#### Dataset Evolution and Schema Enforcement

Delta Lake manages schema evolution while maintaining compatibility:

```python
# Enable schema evolution
spark.conf.set("spark.databricks.delta.schema.autoMerge.enabled", "true")

# Write data with a new schema
new_data.write.format("delta").mode("append").save("/path/to/delta-table")

# Explicitly evolve schema
from delta.tables import DeltaTable

delta_table = DeltaTable.forPath(spark, "/path/to/delta-table")
delta_table.updateMetadata({
  "comment": "Updated table with new features",
  "schemaString": new_schema_json
})
```

#### Dataset Quality Constraints

Delta Lake supports defining and enforcing data quality constraints:

```python
# Define constraints during table creation
spark.sql("""
CREATE TABLE dataset_with_constraints (
  id INT,
  value DOUBLE,
  category STRING,
  timestamp TIMESTAMP
)
USING delta
LOCATION '/path/to/delta-table'
TBLPROPERTIES (
  'delta.constraints.minValues.value' = '0.0',
  'delta.constraints.maxValues.value' = '1.0',
  'delta.constraints.notNull.id' = 'true',
  'delta.constraints.notNull.category' = 'true'
)
""")

# Add constraints to existing table
spark.sql("""
ALTER TABLE dataset_with_constraints
SET TBLPROPERTIES (
  'delta.constraints.minValues.value' = '0.0',
  'delta.constraints.maxValues.value' = '1.0'
)
""")
```

### MLflow for Model Versioning

MLflow provides comprehensive tools for tracking, versioning, and deploying models:

#### Experiment Tracking

MLflow Tracking records all parameters, metrics, and artifacts for model training:

```python
import mlflow
from mlflow.tracking import MlflowClient

# Start a new run
mlflow.start_run(run_name="model_training_run")

# Log parameters
mlflow.log_param("learning_rate", 0.01)
mlflow.log_param("batch_size", 64)
mlflow.log_param("epochs", 10)

# Log metrics during training
for epoch in range(10):
    accuracy = train_epoch(model, data_loader)
    mlflow.log_metric("accuracy", accuracy, step=epoch)

# Log the model
mlflow.sklearn.log_model(model, "model")

# Log dataset information
mlflow.log_input(
    mlflow.data.from_pandas(train_data),
    context="training"
)

# End the run
mlflow.end_run()
```

#### Model Registry

MLflow Model Registry manages the full lifecycle of models:

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Register a model from a run
model_uri = f"runs:/{run_id}/model"
model_details = mlflow.register_model(model_uri, "recommendation_engine")

# Transition a model to staging
client.transition_model_version_stage(
    name="recommendation_engine",
    version=1,
    stage="Staging"
)

# Transition a model to production
client.transition_model_version_stage(
    name="recommendation_engine",
    version=1,
    stage="Production"
)

# Add descriptions and tags
client.update_model_version(
    name="recommendation_engine",
    version=1,
    description="Trained on January 2023 data"
)

client.set_model_version_tag(
    name="recommendation_engine",
    version=1,
    key="data_version",
    value="v20230115"
)
```

#### Model Serving

MLflow simplifies model deployment for serving:

```python
# Load a specific model version for inference
model_uri = f"models:/recommendation_engine/Production"
loaded_model = mlflow.pyfunc.load_model(model_uri)

# Make predictions
predictions = loaded_model.predict(inference_data)

# Deploy model to Databricks Model Serving
client.create_model_version(
    name="recommendation_engine",
    source=model_uri,
    run_id=run_id
)

# Configure serving endpoint
endpoint_config = {
    "name": "recommendation-endpoint",
    "config": {
        "served_models": [{
            "model_name": "recommendation_engine",
            "model_version": "1",
            "workload_size": "Small",
            "scale_to_zero_enabled": True
        }]
    }
}

# Create or update endpoint
client.create_endpoint(endpoint_config)
```

### Databricks Workflows for ML Pipelines

Databricks Workflows orchestrate end-to-end ML pipelines with versioning:

#### Defining ML Workflows

Workflows can be defined using the UI or as code:

```python
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.jobs import Task, JobTaskSettings, NotebookTask

# Initialize client
client = WorkspaceClient()

# Define a multi-task workflow
tasks = [
    Task(
        task_key="data_preparation",
        description="Prepare and version training dataset",
        notebook_task=NotebookTask(
            notebook_path="/Repos/ML/data_preparation",
            base_parameters={"date": "{{date}}"}
        ),
        timeout_seconds=3600
    ),
    Task(
        task_key="model_training",
        description="Train and log model with MLflow",
        depends_on=[{"task_key": "data_preparation"}],
        notebook_task=NotebookTask(
            notebook_path="/Repos/ML/model_training",
            base_parameters={"data_version": "{{tasks.data_preparation.parameters.output_version}}"}
        ),
        timeout_seconds=7200
    ),
    Task(
        task_key="model_validation",
        description="Validate model quality",
        depends_on=[{"task_key": "model_training"}],
        notebook_task=NotebookTask(
            notebook_path="/Repos/ML/model_validation",
            base_parameters={"run_id": "{{tasks.model_training.parameters.run_id}}"}
        )
    ),
    Task(
        task_key="model_deployment",
        description="Register and deploy model",
        depends_on=[{"task_key": "model_validation"}],
        notebook_task=NotebookTask(
            notebook_path="/Repos/ML/model_deployment",
            base_parameters={
                "run_id": "{{tasks.model_training.parameters.run_id}}",
                "deploy_to": "staging"
            }
        )
    )
]

# Create the job
job = client.jobs.create(
    name="recommendation_engine_pipeline",
    tasks=tasks,
    schedule={
        "quartz_cron_expression": "0 0 0 ? * MON *",
        "timezone_id": "UTC"
    }
)
```

#### Parameterizing Workflows

Parameterization enables flexible pipeline execution:

```python
# Define parameters for the workflow
parameters = {
    "data_version": "latest",
    "training_dataset": "/path/to/training/data",
    "validation_dataset": "/path/to/validation/data",
    "model_name": "recommendation_engine",
    "deploy_target": "staging"
}

# Run the workflow with parameters
run_id = client.jobs.run_now(
    job_id=job_id,
    parameters=parameters
).result().run_id
```

#### Workflow Versioning

Databricks supports versioning the workflow definitions themselves:

```python
# Export workflow definition
job_definition = client.jobs.get(job_id=job_id)

# Store definition in version control
import json
with open("workflow_definition.json", "w") as f:
    json.dump(job_definition, f, indent=2)

# Import workflow definition
with open("workflow_definition.json", "r") as f:
    job_definition = json.load(f)
    
# Create new job from definition
new_job_id = client.jobs.create(**job_definition).job_id
```

## Implementing End-to-End ML CI/CD with Databricks

Let's explore a comprehensive implementation of CI/CD for ML systems using Databricks workflows.

### CI/CD Pipeline Architecture

A complete ML CI/CD pipeline typically includes these stages:

1. **Data Preparation and Validation**
2. **Feature Engineering and Storage**
3. **Model Training and Logging**
4. **Model Evaluation and Testing**
5. **Model Registration and Promotion**
6. **Deployment and Monitoring**

### Data Preparation and Validation Stage

This stage ensures data quality and creates versioned datasets:

```python
# Data Preparation Notebook

import mlflow
from delta.tables import DeltaTable
from pyspark.sql.functions import col, current_timestamp

# Start tracking
mlflow.start_run(run_name="data_preparation")

# Log parameters
mlflow.log_param("data_source", data_source_path)
mlflow.log_param("target_date", target_date)

# Load raw data
raw_data = spark.read.format("delta").load(data_source_path)

# Validate data schema
expected_columns = ["user_id", "item_id", "rating", "timestamp"]
actual_columns = raw_data.columns

if set(expected_columns).issubset(set(actual_columns)):
    mlflow.log_metric("schema_validation", 1.0)
else:
    mlflow.log_metric("schema_validation", 0.0)
    raise ValueError(f"Schema validation failed. Expected columns: {expected_columns}")

# Validate data quality
null_counts = raw_data.select([sum(col(c).isNull().cast("int")).alias(c) for c in raw_data.columns])
null_counts_dict = {c: null_counts.select(c).first()[0] for c in null_counts.columns}
mlflow.log_metrics({"null_" + k: v for k, v in null_counts_dict.items()})

# Check for anomalies in distributions
rating_stats = raw_data.select("rating").summary().collect()
rating_stats_dict = {r["summary"]: float(r["rating"]) for r in rating_stats}
mlflow.log_metrics({
    "rating_min": rating_stats_dict["min"],
    "rating_max": rating_stats_dict["max"],
    "rating_mean": rating_stats_dict["mean"]
})

# Process and clean data
processed_data = (raw_data
    .filter(col("rating").isNotNull())
    .filter(col("user_id").isNotNull())
    .filter(col("item_id").isNotNull())
    .withColumn("processed_at", current_timestamp())
)

# Write to versioned Delta table
output_path = f"{processed_data_path}/date={target_date}"
processed_data.write.format("delta").mode("overwrite").save(output_path)

# Get the version number
delta_table = DeltaTable.forPath(spark, output_path)
version = delta_table.history(1).select("version").collect()[0][0]

# Log dataset information
mlflow.log_param("output_path", output_path)
mlflow.log_param("output_version", version)
mlflow.log_metric("record_count", processed_data.count())

# End tracking
mlflow.end_run()

# Return parameters for next stage
dbutils.jobs.taskValues.set("o<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>