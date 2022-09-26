use instructions::*;
use anchor_lang::prelude::*;

declare_id!("9R9BdZFdYwwqCYoC3YkPD8M746Eyu3qh4MdUhB17UbY4");
pub mod state;
pub mod instructions;

#[program]
pub mod solchan_contract {
    use super::*;

    pub fn init_imageboard(ctx: Context<InitImageboard>) -> Result<()> {
        instructions::init_imageboard(ctx)
    }
    pub fn start_thread(ctx: Context<StartThread>, text: String, image: [u8;32]) -> Result<()> {
        instructions::start_thread(ctx, text, image)
    }
    pub fn reply_to_thread(ctx: Context<ReplyToThread>, text: String, image: [u8;32]) -> Result<()> {
        instructions::reply_to_thread(ctx, text, image)
    }
}
