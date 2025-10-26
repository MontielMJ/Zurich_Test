using System;
using System.Collections.Generic;
using Domain.Entities;
using Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data;

public partial class ZurichDbContext : DbContext
{
    public ZurichDbContext(DbContextOptions<ZurichDbContext> options)
        : base(options)
    {
    }

    public DbSet<Client> Clients { get; set; }
    public DbSet<Policy> Policies { get; set; }

    public virtual DbSet<Roles> Roles { get; set; }

    public virtual DbSet<PolicyType> TypePolicy { get; set; }

    public virtual DbSet<Users> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var emailConverter = new ValueConverter<Email, string>(
        v => v.Value,
        v => new Email(v)
        );

        var policyNumberConverter = new ValueConverter<PolicyNumber, decimal>(
            v => v.Value,
            v => new PolicyNumber(v)
            );

        modelBuilder.Entity<Client>(entity =>
        {
            entity.ToTable("clients");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Fullname).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.Email).HasColumnName("email").HasConversion(emailConverter).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.Phone).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.IdentificationNumber).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.CreateAt).HasColumnType("datetime");
            entity.Property(e => e.Status).HasColumnType("boolean");

            entity.HasMany(e => e.Policies).WithOne(p => p.Client)
                .HasForeignKey(p => p.IdClient)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_tbl_insurance_policies_tbl_clients");
        });

        modelBuilder.Entity<Policy>(entity =>
        {
            entity.ToTable("insurancePolicies");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Folio).HasColumnName("folio").HasConversion(policyNumberConverter).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.InitDate).HasColumnName("initDate").HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnName("endDate").HasColumnType("datetime");
            entity.Property(e => e.InsuredAmount).HasColumnName("insuredAmount").HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IdClient).HasColumnName("idClient").HasColumnType("int");
            entity.Property(e => e.IdTypePolicy).HasColumnName("idTypePolicy").HasColumnType("int");
            entity.Property(e => e.Status).HasColumnName("status").HasColumnType("boolean");

        });

        modelBuilder.Entity<Roles>(entity =>
        {
            entity.ToTable("catRoles");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Rol).HasColumnName("rol").HasMaxLength(50);
            entity.Property(e => e.CreateAt).HasColumnName("createAt").HasColumnType("datetime");
            entity.Property(e => e.Status).HasColumnName("status").HasColumnType("boolean");

        });

        modelBuilder.Entity<PolicyType>(entity =>
        {
            entity.ToTable("catTypePolicy");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Type).HasColumnName("type").HasMaxLength(50);
            entity.Property(e => e.Status).HasColumnName("status").HasColumnType("boolean");

        });

        modelBuilder.Entity<Users>(entity =>
        {
            entity.ToTable("catUsers");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.User).HasColumnName("user").HasMaxLength(50);
            entity.Property(e => e.Password).HasColumnName("password").HasMaxLength(50);
            entity.Property(e => e.IdRol).HasColumnName("idRol").HasColumnType("int");
            entity.Property(e => e.Status).HasColumnName("status").HasColumnType("bit"); // boolean → bit
            entity.Property(e => e.CreateAt).HasColumnName("createAt").HasColumnType("datetime");

       
            entity.HasOne(d => d.Role)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.IdRol)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tbl_cat_users_tb_cat_roles");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
