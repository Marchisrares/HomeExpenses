using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class MonthsData
    {
        public int ID { get; set; }
        public string MonthYear { get; set; }
        public string MonthNumber { get; set; }
        public string TableName { get; set; }
        public string Date { get; set; }
        public string Name { get; set; }
        public string Amount { get; set; }
    }
}
