export type SolchanContract = {
  "version": "0.1.0",
  "name": "solchan_contract",
  "instructions": [
    {
      "name": "initImageboard",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "imageboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startThread",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "imageboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "text",
          "type": "string"
        },
        {
          "name": "image",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "replyToThread",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reply",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "text",
          "type": "string"
        },
        {
          "name": "image",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "imageboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "threads",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "threads",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "threadId",
            "type": "u64"
          },
          {
            "name": "content",
            "type": {
              "defined": "Content"
            }
          },
          {
            "name": "replyCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "reply",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "threadId",
            "type": "u64"
          },
          {
            "name": "replyId",
            "type": "u64"
          },
          {
            "name": "content",
            "type": {
              "defined": "Content"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Content",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "replier",
            "type": "publicKey"
          },
          {
            "name": "text",
            "type": "string"
          },
          {
            "name": "image",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    }
  ]
};

export const IDL: SolchanContract = {
  "version": "0.1.0",
  "name": "solchan_contract",
  "instructions": [
    {
      "name": "initImageboard",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "imageboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startThread",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "imageboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "text",
          "type": "string"
        },
        {
          "name": "image",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "replyToThread",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reply",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "text",
          "type": "string"
        },
        {
          "name": "image",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "imageboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "threads",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "threads",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "threadId",
            "type": "u64"
          },
          {
            "name": "content",
            "type": {
              "defined": "Content"
            }
          },
          {
            "name": "replyCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "reply",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "threadId",
            "type": "u64"
          },
          {
            "name": "replyId",
            "type": "u64"
          },
          {
            "name": "content",
            "type": {
              "defined": "Content"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Content",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "replier",
            "type": "publicKey"
          },
          {
            "name": "text",
            "type": "string"
          },
          {
            "name": "image",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    }
  ]
};
