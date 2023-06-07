using API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonthsDataController : ControllerBase
    {
        public readonly MonthsDataContext context;

        public MonthsDataController(MonthsDataContext _context)
        {
            context = _context;
        }

        // Will Return List of Month Names with Year in Ascending Order
        [HttpGet("GetListOfMonths")]
        public IActionResult GetListOfMonths()
        {
            var monthsList = (from x in context.MonthsData
                              group x by new
                              {
                                  monthYear = x.MonthYear,
                                  monthNumber = x.MonthNumber
                              } into monthsGroup
                              orderby monthsGroup.Key.monthYear.Length ascending,
                                      monthsGroup.Key.monthYear ascending,
                                      monthsGroup.Key.monthNumber.Length ascending,
                                      monthsGroup.Key.monthNumber ascending
                              select monthsGroup.Key).ToList();
            return Ok(monthsList);
        }

        // Return - All the rows of specified Table
        [HttpGet("GetTableData")]
        public IActionResult GetTableData(string monthYear, string monthNumber, string tableName)
        {
            var tableData = (from x in context.MonthsData
                             where x.MonthYear == monthYear && x.MonthNumber == monthNumber && x.TableName == tableName
                             select new
                             {
                                 id = x.ID,
                                 date = x.Date,
                                 name = x.Name,
                                 amount = x.Amount
                             }).ToList();
            return Ok(tableData);
        }

        // Inserts the Row into DB
        [HttpPost("InsertTableRow")]
        public IActionResult InsertTableRow(MonthsData monthsDataFromFrontEnd)
        {
            context.MonthsData.Add(monthsDataFromFrontEnd);
            context.SaveChanges();
            var id = context.MonthsData.OrderByDescending(p => p.ID).FirstOrDefault().ID;
            return Ok(id);
        }

        // Deletes Row From DB
        [HttpDelete("DeleteTableRow/{id}")]
        public IActionResult DeleteTableRow(int id)
        {
            var x = context.MonthsData.Where(item => item.ID == id).FirstOrDefault();
            context.MonthsData.Remove(x);
            context.SaveChanges();
            return Ok("success");
        }
    }
}
