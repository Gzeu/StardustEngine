#![no_std]

#[allow(unused_imports)]
use multiversx_sc::imports::*;

/// Gaming Infrastructure Contract for MultiversX
/// Provides basic gaming functionality for StardustEngine
#[multiversx_sc::contract]
pub trait StardustContracts {
    #[init]
    fn init(&self) {}

    #[upgrade] 
    fn upgrade(&self) {}
    
    /// Test endpoint - returns a welcome message
    #[endpoint]
    fn hello(&self) -> ManagedBuffer {
        ManagedBuffer::from(b"Hello from StardustEngine!")
    }
    
    /// Get contract version
    #[endpoint]
    fn get_version(&self) -> ManagedBuffer {
        ManagedBuffer::from(b"v1.0.0")
    }
}
