using Microsoft.EntityFrameworkCore;
using restApi.Data;
using restApi.Data.Services;

var _policyName = "CorsPolicy";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DB>(options =>
{
  options.UseNpgsql(builder.Configuration.GetConnectionString("MySQLDBContext"));
});
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IReaderService, ReaderService>();
builder.Services.AddCors(opt =>
        {
          opt.AddPolicy(name: _policyName, builder =>
          {
            builder.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
          });
        }); ;

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(_policyName);
app.UseAuthorization();

app.MapControllers();


app.Run();
