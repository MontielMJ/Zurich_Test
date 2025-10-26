
PRINT 'Iniciando creación de base de datos ZurichDB...';
GO

-- Verificar y crear la base de datos
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'ZurichDB')
BEGIN
    CREATE DATABASE ZurichDB;
END
GO

USE [ZurichDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Crear tabla catRoles
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='catRoles' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[catRoles](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [rol] [varchar](50) NOT NULL,
        [createAt] [date] NOT NULL,
        [status] [bit] NOT NULL,
        CONSTRAINT [PK_catRoles] PRIMARY KEY CLUSTERED ([id] ASC)
    ) ON [PRIMARY]
END
GO

-- Crear tabla catTypePolicy
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='catTypePolicy' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[catTypePolicy](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [type] [varchar](50) NOT NULL,
        [status] [bit] NOT NULL,
        CONSTRAINT [PK_catTypePolicy] PRIMARY KEY CLUSTERED ([id] ASC)
    ) ON [PRIMARY]
END
GO

-- Crear tabla catUsers
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='catUsers' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[catUsers](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [user] [varchar](50) NOT NULL,
        [password] [varchar](50) NOT NULL,
        [idRol] [int] NOT NULL,
        [createAt] [date] NOT NULL,
        [status] [bit] NOT NULL,
        CONSTRAINT [PK_catUsers] PRIMARY KEY CLUSTERED ([id] ASC)
    ) ON [PRIMARY]
END
GO

-- Crear tabla clients
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='clients' AND xtype='U')
BEGIN
CREATE TABLE [dbo].[clients](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[fullname] [varchar](100) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[phone] [numeric](10, 0) NOT NULL,
	[identificationNumber] [numeric](10, 0) NOT NULL,
	[createAt] [date] NOT NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_tbl_clients] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO

-- Crear tabla insurancePolicies
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='insurancePolicies' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[insurancePolicies](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [folio] [numeric](10) NOT NULL,
        [initDate] [datetime] NOT NULL,
        [endDate] [datetime] NOT NULL,
        [insuredAmount] [decimal](18, 2) NOT NULL,
        [idClient] [int] NOT NULL,
        [idTypePolicy] [int] NOT NULL,
        [status] [bit] NOT NULL,
        CONSTRAINT [PK_insurancePolicies] PRIMARY KEY CLUSTERED ([id] ASC)
    ) ON [PRIMARY]
END
GO

-- Crear foreign keys solo si no existen
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_catUsers_catRoles')
BEGIN
    ALTER TABLE [dbo].[catUsers] WITH CHECK 
    ADD CONSTRAINT [FK_catUsers_catRoles] FOREIGN KEY([idRol])
    REFERENCES [dbo].[catRoles] ([id])
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_insurancePolicies_catTypePolicy')
BEGIN
    ALTER TABLE [dbo].[insurancePolicies] WITH CHECK 
    ADD CONSTRAINT [FK_insurancePolicies_catTypePolicy] FOREIGN KEY([idTypePolicy])
    REFERENCES [dbo].[catTypePolicy] ([id])
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_insurancePolicies_clients')
BEGIN
    ALTER TABLE [dbo].[insurancePolicies] WITH CHECK 
    ADD CONSTRAINT [FK_insurancePolicies_clients] FOREIGN KEY([idClient])
    REFERENCES [dbo].[clients] ([id])
END
GO

-- Insertar datos en catRoles si no existen
IF NOT EXISTS (SELECT 1 FROM [dbo].[catRoles])
BEGIN
    INSERT INTO [dbo].[catRoles] ([rol], [createAt], [status])
    VALUES 
        ('Admin', CAST(GETDATE() AS DATE), 1),
        ('Client', CAST(GETDATE() AS DATE), 1)
END
GO

-- Insertar datos en catTypePolicy si no existen
IF NOT EXISTS (SELECT 1 FROM [dbo].[catTypePolicy])
BEGIN
    INSERT INTO [dbo].[catTypePolicy] ([type], [status])
    VALUES 
        ('Vida', 1),
        ('Automovil', 1), -- Corregido "Automivil" a "Automovil"
        ('Salud', 1),
        ('Hogar', 1),
        ('Empresarial', 1),
        ('Viaje', 1) -- Eliminada coma extra
END
GO

-- Insertar datos en catUsers si no existen
IF NOT EXISTS (SELECT 1 FROM [dbo].[catUsers])
BEGIN
    INSERT INTO [dbo].[catUsers] ([user], [password], [idRol], [createAt], [status])
    VALUES 
        ('jmontiel', '123456', 1, CAST(GETDATE() AS DATE), 1),
        ('cmontiel', '123456', 2, CAST(GETDATE() AS DATE), 1) -- Cambiado idRol a 2 (Client)
END
GO

-- Mensaje de confirmación
PRINT 'Base de datos ZurichDB creada y poblada exitosamente!'
GO