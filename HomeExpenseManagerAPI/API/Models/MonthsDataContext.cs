using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class MonthsDataContext : DbContext
    {
        public MonthsDataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<MonthsData> MonthsData { get; set; }
    }
}
