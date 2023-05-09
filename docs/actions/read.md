# Read CRUD Action

MillieJS provides the an interface for Read actions that sync between a
replica store and the upstream source. The sync action in operation today is
rudimentary, however, with no real fault-tolerance, scalability, or
concurrency (see below).

## Current

```mermaid
sequenceDiagram
    Client->>Millie: read Entities (from request)
    par In parallel
        critical Read from Replica with requested payload
            Millie->>Replica: read Entities (from request)
        end
    and
        critical Read from Replica with requested payload
            Millie->>Source: read Entities (from request)
        end
    end
    Replica->>Client: return fetched Replica Entities to requesting client
    Source-->>Client: eventually return fetched Source Entities to requesting client
```

## Future Plans

This first iteration of MillieJS only covers basic sync capabilities. This is
by all means a minimally-viable product ("MVP") with intentional limitations in
place, however, future scale is coming.

More information can be found at the following links:
- Support CRUD action concurrency (#19)
- CRUD action fault-tolerance (#27)
- Expand Query capabilities (#28)
- Investigate CRUD action improvements (#49)
