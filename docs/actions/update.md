# Update CRUD Action

MillieJS provides the an interface for Update actions that sync between a
replica store and the upstream source. The sync action in operation today is
rudimentary, however, with no real fault-tolerance, scalability, or
concurrency (see below).

## Current

```mermaid
sequenceDiagram
    Client->>Millie: update Entities (from request)
    par In parallel
        critical Update Replica with requested action and payload
            Millie->>Replica: update Entities (from request)
        end
    and
        critical Update Source with requested action and payload
            Millie->>Source: update Entities (from request)
        end
    end
    Replica->>Client: return updated Replica Entities to requesting client
    Source-->>Client: eventually return updated Source Entities to requesting client
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
