CREATE DATABASE ZurichDB;
GO

USE [ZurichDB]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tb_cat_roles] (
	[id] [int] IDENTITY(1, 1) NOT NULL
	,[rol] [varchar](50) NOT NULL
	,[createAt] [date] NOT NULL
	,[status] [bit] NOT NULL
	,CONSTRAINT [PK_tb_cat_roles] PRIMARY KEY CLUSTERED ([id] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		,OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
		) ON [PRIMARY]
	) ON [PRIMARY]
GO

CREATE TABLE [dbo].[tbl_cat_type_policy] (
	[id] [int] IDENTITY(1, 1) NOT NULL
	,[type] [varchar](50) NOT NULL
	,[status] [bit] NOT NULL
	,CONSTRAINT [PK_tbl_cat_type_policy] PRIMARY KEY CLUSTERED ([id] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		,OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
		) ON [PRIMARY]
	) ON [PRIMARY]
GO

CREATE TABLE [dbo].[tbl_cat_users] (
	[id] [int] IDENTITY(1, 1) NOT NULL
	,[user] [varchar](50) NOT NULL
	,[password] [varchar](50) NOT NULL
	,[idRol] [int] NOT NULL
	,[createAt] [date] NOT NULL
	,[status] [nchar](10) NOT NULL
	,CONSTRAINT [PK_tbl_cat_users] PRIMARY KEY CLUSTERED ([id] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		,OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
		) ON [PRIMARY]
	) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tbl_cat_users]
	WITH CHECK ADD CONSTRAINT [FK_tbl_cat_users_tb_cat_roles] FOREIGN KEY ([idRol]) REFERENCES [dbo].[tb_cat_roles]([id])
GO

ALTER TABLE [dbo].[tbl_cat_users] CHECK CONSTRAINT [FK_tbl_cat_users_tb_cat_roles]
GO

CREATE TABLE [dbo].[tbl_clients] (
	[id] [int] IDENTITY(1, 1) NOT NULL
	,[fullname] [varchar](100) NOT NULL
	,[email] [varchar](100) NOT NULL
	,[phone] [numeric](10, 0) NOT NULL
	,[identificationNumber] [numeric](10, 0) NOT NULL
	,[createAt] [date] NOT NULL
	,[status] [bit] NOT NULL
	,CONSTRAINT [PK_tbl_clients] PRIMARY KEY CLUSTERED ([id] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		,OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
		) ON [PRIMARY]
	) ON [PRIMARY]
GO

CREATE TABLE [dbo].[tbl_insurance_policies] (
	[id] [int] IDENTITY(1, 1) NOT NULL
	,[folio] [numeric](10, 0) NOT NULL
	,[initDate] [date] NOT NULL
	,[endDate] [date] NOT NULL
	,[insuredAmount] [decimal](18, 2) NOT NULL
	,[idClient] [int] NOT NULL
	,[idTypePolicy] [int] NOT NULL
	,[status] [bit] NOT NULL
	,CONSTRAINT [PK_tbl_insurance_policies] PRIMARY KEY CLUSTERED ([id] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		,OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
		) ON [PRIMARY]
	) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tbl_insurance_policies]
	WITH CHECK ADD CONSTRAINT [FK_tbl_insurance_policies_tbl_clients] FOREIGN KEY ([idTypePolicy]) REFERENCES [dbo].[tbl_cat_type_policy]([id])
GO

ALTER TABLE [dbo].[tbl_insurance_policies] CHECK CONSTRAINT [FK_tbl_insurance_policies_tbl_clients]
GO

ALTER TABLE [dbo].[tbl_insurance_policies]
	WITH CHECK ADD CONSTRAINT [FK_tbl_insurance_policies_tbl_clients1] FOREIGN KEY ([idClient]) REFERENCES [dbo].[tbl_clients]([id])
GO

ALTER TABLE [dbo].[tbl_insurance_policies] CHECK CONSTRAINT [FK_tbl_insurance_policies_tbl_clients1]
GO


