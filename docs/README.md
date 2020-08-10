# Here is the document the proline project

## Channel

A channel must have those properities:

- A public key
- Creater name
- Description
- Signature from channel

And *the channel id* (abbr. *cid*) was equals to the md5sum of the public key.

## Post

A post must have those properities:

- Post ID
- Title
- Author name
- Publish date
- Content
- Attached files (Optional)
- Signature from channel

*The post id* is random but should be unique in channel.

## Attached File

A file must have those properities:

- File ID
- File original name
- total piece number
- every piece hash
- Signature from channel

*The file ID* equals to the md5sum of the hole file.
