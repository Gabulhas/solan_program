use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct Content {
    pub replier: Pubkey, // 32
    pub text: String,    // 360 * 4;
    pub image: [u8; 32], // 32
}

impl Content {
    pub const SIZE: usize = 8 + 32 + 360 * 4 + 32;
    pub fn new(replier: Pubkey, text: String, image: [u8; 32]) -> Content {
        Content {
            replier,
            text,
            image,
        }
    }
}

#[account]
pub struct Imageboard {
    pub authority: Pubkey,
    pub threads: u64,
}

impl Imageboard {
    pub const SIZE: usize = 8 + 8 + 8;
    pub fn new(authority: Pubkey) -> Imageboard {
        Imageboard {
            authority,
            threads: 0,
        }
    }
}

#[account]
pub struct Threads {
    pub content: Content,
    pub reply_count: u64,
}

impl Threads {
    pub const SIZE: usize = 8 + Content::SIZE * 8;
    pub fn new(content: Content) -> Threads {
        Threads {
            content,
            reply_count: 0,
        }
    }
}

#[account]
pub struct Reply {
    pub content: Content,
}

impl Reply {
    pub const SIZE: usize = 8 + Content::SIZE;
    pub fn new(content: Content) -> Reply {
        Reply { content }
    }
}
