
library(shiny)

# Define server logic required to draw a histogram
server <- function(input, output) {

    output$distPlot <- renderPlot({

        # generate bins based on input$bins from ui.R
        x    <- faithful[, 2]
        bins <- seq(min(x), max(x), length.out = input$bins + 1)

        # draw the histogram with the specified number of bins
        hist(x, breaks = bins, col = 'darkgray', border = 'white')
        2+8
    })

}

shinyApp(ui = htmlTemplate("www/network.html",
                           button = actionButton("action", "Action"),
                           slider = sliderInput("x", "X", 1, 100, 50)), server)
