use instructions::*;
use anchor_lang::prelude::*;

declare_id!("HLN8PXJgGPHkATnWqWCABgaszEUPR9x13zc9iL6sz883");
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
