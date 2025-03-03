using AutoMapper;
using TequioDemoTrack.Models;
using TequioDemoTrack.Models.DTOs;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {

        CreateMap<UserProfile, UserProfileDTO>();
        CreateMap<UserProfileDTO, UserProfile>();
        CreateMap<UserProfile, EditUserProfileDTO>();
        CreateMap<EditUserProfileDTO, UserProfile>();

        CreateMap<Customer, CustomerDTO>();
        CreateMap<CustomerDTO, Customer>();

        CreateMap<Customer, CreateCustomerDTO>();
        CreateMap<CreateCustomerDTO, Customer>();

        CreateMap<Employee, EmployeeDTO>();
        CreateMap<EmployeeDTO, Employee>();

        CreateMap<Employee, CreateEmployeeDTO>();
        CreateMap<CreateEmployeeDTO, Employee>();

        CreateMap<Product, ProductDTO>();
        CreateMap<ProductDTO, Product>();
        CreateMap<Product, CreateProductDTO>();
        CreateMap<CreateProductDTO, Product>();

        CreateMap<Purchase, PurchaseDTO>();
        CreateMap<PurchaseDTO, Purchase>();
        CreateMap<Purchase, CreatePurchaseDTO>();
        CreateMap<CreatePurchaseDTO, Purchase>();

        CreateMap<PurchaseProduct, PurchaseProductDTO>();
        CreateMap<PurchaseProductDTO, PurchaseProduct>();
        CreateMap<PurchaseProduct, CreatePurchaseProductDTO>();
        CreateMap<CreatePurchaseProductDTO, PurchaseProduct>();
        CreateMap<PurchaseProduct, UpdatePurchaseProductDTO>();
        CreateMap<UpdatePurchaseProductDTO, PurchaseProduct>();
    }
}