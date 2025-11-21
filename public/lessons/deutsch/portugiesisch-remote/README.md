# Portuguese Remote - URL-based Testing Topic

This topic demonstrates **URL-based lesson loading** by referencing the existing Portuguese lessons via remote URLs.

## Purpose

- **Testing**: Verify that lessons can be loaded from remote sources
- **Demonstration**: Show how mixed local/remote content works
- **Documentation**: Example of URL-based lesson references

## Structure

This topic folder contains only a `lessons.yaml` file that references lessons via URLs. The actual lesson content (`content.yaml` and `audio/` files) is fetched from the URLs.

## URLs Used

All URLs point to the Portuguese lessons on GitHub Pages:
```
https://felixboehm.github.io/language/lessons/deutsch/portugiesisch/01-essential-verbs
https://felixboehm.github.io/language/lessons/deutsch/portugiesisch/02-action-verbs
...
```

## Production Use

In production, these URLs would point to:
- **CDN**: `https://cdn.example.com/lessons/...`
- **IPFS**: `ipfs://QmHash.../lessons/...` (auto-resolved to HTTP gateway)
- **Any web server**: `https://example.com/lessons/...`

## Benefits

1. **No duplication**: Reuses existing lesson content
2. **Distributed hosting**: Lessons can be hosted anywhere
3. **Independent updates**: Remote lessons can be updated independently
4. **Scalability**: Large lesson libraries don't need local storage
