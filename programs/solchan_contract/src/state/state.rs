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
    pub authority: Pubkey, //32
    pub threads: u64,      //8
}

impl Imageboard {
    pub const SIZE: usize = 8 + 8 + 32;
    pub fn new(authority: Pubkey) -> Imageboard {
        Imageboard {
            authority,
            threads: 0,
        }
    }
}

#[account]
pub struct Threads {
    pub thread_id: u64,
    //MAYBE ADD TITLE? 
    pub content: Content,
    pub reply_count: u64,
}

impl Threads {
    pub const SIZE: usize = 8 + 8 + Content::SIZE + 8;
    pub fn new(content: Content, thread_id: u64) -> Threads {
        Threads {
            thread_id,
            content,
            reply_count: 0,
        }
    }
}

#[account]
pub struct Reply {
    pub thread_id: u64,
    pub reply_id: u64,
    pub content: Content,
}

impl Reply {
    pub const SIZE: usize = 8 + 8 + 8 + Content::SIZE;
    pub fn new(content: Content, thread_id: u64, reply_id: u64) -> Reply {
        Reply { content, thread_id, reply_id }
    }
}
