# API

For all API, we use the same header:

> `$xx` means a byte in hex, `%xxxxxxxx` means a byte in binary.

```
$11 45 14    - the proline protocol
$xx          - API version, current is $01
$xx xx xx xx - Request ID (reply the same)
$xx          - type
$xx          - sub type
<...>        - more ...
```

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

### Sub Type `$03`: Reject for channel information

I don't know.

```
<proline header>
```

## Type `$02`: Posts

### Sub Type `$01`: Ask for the post list

Is my post list the newest?

```
<proline header>
16 * $xx     - The channel ID
```

### Sub Type `$02`: Reply for post list

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

### Sub Type `$03`: SHIRANAI!!!

I didn't even subscribe that?!

```
<proline header>
```

### Sub Type `$11`: Ask for post information

Hey I want to know more about that post.

```
<proline header>
16 * $xx     - The channel ID
16 * $xx     - The post ID
```

### Sub Type `$12`: Reply for post information

Let me tell ya.

```
<proline header>
16 * $xx     - The channel ID
16 * $xx     - The post ID ------------------+
$xx xx       - Title length                  |
<...>        - Title                         |
$xx xx       - Author length                 |
<...>        - Author                        |
8 * $xx      - Date (Date.now())             |
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
$01 - Markdown
$02 - HTML (scripts disabled)
$03 - Raw
```

### Sub Type `$13`: I don't know

```
<proline header>
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
16 * $xx     - The channel ID
16 * $xx     - The file ID ------------------+
$xx xx       - Filename length               |
<...>        - Filename                      |
$xx xx xx xx - Total piece number        = n +-('a)
n times {                                    |
$xx xx xx xx - piece length                  |
16 * $xx     - piece hash                    |
} -------------------------------------------+
$xx xx       - Signature length
<...>        - Signature            = hash('a)
```

### Sub Type `$03`: I don't know

```
<proline header>
```

### Sub Type `$11`: Ask for file piece

```
<proline header>
16 * $xx     - The channel ID
16 * $xx     - The file ID
$xx xx xx xx - piece number (from 0)
```

### Sub Type `$12`: Reply for file piece

```
<proline header>
$xx xx xx xx - piece length
<...>        - piece content
```

### Sub Type `$13`: I don't know

```
<proline header>
```

