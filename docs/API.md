# API

[toc]

For all API, we use the same header:

> `$xx` means a byte in hex, `%xxxxxxxx` means a byte in binary.

```
$11 45 14    - the proline protocol
$xx          - API version, current is $01
$xx xx xx xx - Request ID
$xx          - type
$xx          - sub type
<...>        - more ...
```

If A send an ask to B with a Request ID, then B should reply with the same Request ID.

## Type `$00`: I don't know

### Sub Type `$00`: I really don't know

No content required.

## Type `$01`: Subscribe

Here is about channel subscribes.

### Sub Type `$01`: Ask for channel information

Is anyone heard about this channel?

```
<proline header>
16 * $xx     - The channel ID
```

### Sub Type `$02`: Reply for channel information

Sure I know that.

```
<proline header>
16 * $xx     - The channel ID ----------+
$xx xx       - Creater name length      |
<...>        - Creater name (UTF-8)     |
$xx xx xx xx - Description length       +-('a)
<...>        - Description (UTF-8)      |
$xx xx xx xx - The public key length    |
<...>        - The public key ----------+
$xx xx       - Signature length
<...>        - Signature            = hash('a)
```

### Sub Type `$03`: Ask for public key only

```
<proline header>
16 * $xx     - The channel ID
```

### Sub Type `$04`: Reply for public key only

```
<proline header>
$xx xx xx xx - The public key length
<...>        - The public key
```

The channel ID should equal to the md5sum of the public key.

## Type `$02`: Posts

### Sub Type `$01`: Ask for the post list of a channel

Is my post list the newest?

```
<proline header>
16 * $xx     - The channel ID
```

### Sub Type `$02`: Reply for post list of a channel

This is my post list.

```
<proline header>
$xx xx xx xx - Number of posts       = n
n times {
16 * $xx     - The post ID
$xx xx       - Title length
<...>        - Title
}
```

### Sub Type `$03`: Ask for post information

Hey I want to know more about that post.

```
<proline header>
16 * $xx     - The channel ID
16 * $xx     - The post ID
```

### Sub Type `$04`: Reply for post information

Let me tell ya.

```
<proline header>
16 * $xx     - The post ID ------------------+
$xx xx       - Title length                  |
<...>        - Title                         |
$xx xx       - Author length                 |
<...>        - Author                        |
8 * $xx      - Date                          |
$xx          - Content type                  +-('a)
$xx xx xx xx - Content length                |
<...>        - Content                       |
$xx xx       - Attached file number    = n   |
n times {                                    |
16 * $xx     - The file ID                   |
$xx xx       - Filename length               |
<...>        - Filename                      |
} -------------------------------------------+
$xx xx       - Signature length
<...>        - Signature            = hash('a)
```

where content type is:

```
$00 - Text (Raw)
$01 - Markdown
$02 - HTML (scripts disabled)
```

## Type `$03`: Files

### Sub Type `$01`: Ask for a file's metadata

```
<proline header>
16 * $xx     - The channel ID
16 * $xx     - The file ID
```

### Sub Type `$02`: Reply for file's metadata

```
<proline header>
16 * $xx     - The file ID ------------------+
$xx xx       - Filename length               |
<...>        - Filename                      |
$xx xx xx xx - Piece number              = n +-('a)
n times {                                    |
$xx xx xx xx - Piece length                  |
16 * $xx     - Piece hash                    |
} -------------------------------------------+
$xx xx       - Signature length
<...>        - Signature            = hash('a)
```

### Sub Type `$03`: Ask for file piece

```
<proline header>
16 * $xx     - The channel ID
16 * $xx     - The file ID
$xx xx xx xx - Piece index (from 0)
```

### Sub Type `$04`: Reply for file piece

```
<proline header>
$xx xx xx xx - Piece length
<...>        - Piece content
```

