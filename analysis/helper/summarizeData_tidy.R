library(dplyr)

## Summarizes data.
## Gives count, mean, standard deviation, standard error of the mean, and confidence interval (default 95%).
##   data: a data frame.
##   measurevar: the name of a column that contains the variable to be summariezed
##   groupvars: a vector containing names of columns that contain grouping variables
##   na.rm: a boolean that indicates whether to ignore NA's
##   conf.interval: the percent range of the confidence interval (default is 95%)
summarySE <- function(data = NULL, measurevar, groupvars = NULL, na.rm = FALSE,
                      conf.interval = .95, .drop = TRUE) {
  
  data %>%
    group_by(across(all_of(groupvars))) %>%
    summarise(
      N = sum(!is.na(.data[[measurevar]]), na.rm = na.rm),
      mean = mean(.data[[measurevar]], na.rm = na.rm),
      sd = sd(.data[[measurevar]], na.rm = na.rm),
      .groups = if (.drop) 'drop' else 'keep'
    ) %>%
    mutate(
      se = sd / sqrt(N),
      ciMult = qt(conf.interval / 2 + .5, df = N - 1),
      ci = se * ciMult
    ) %>%
    dplyr::rename_with(~ measurevar, .cols = mean)  # Rename the mean column to the name of the measurevar
}

## Norms the data within specified groups in a data frame; it normalizes each
## subject (identified by idvar) so that they have the same mean, within each group
## specified by betweenvars.
##   data: a data frame.
##   idvar: the name of a column that identifies each subject (or matched subjects)
##   measurevar: the name of a column that contains the variable to be summariezed
##   betweenvars: a vector containing names of columns that are between-subjects variables
##   na.rm: a boolean that indicates whether to ignore NA's
normDataWithin <- function(data = NULL, idvar, measurevar, betweenvars = NULL,
                           na.rm = FALSE, .drop = TRUE) {
  
  # Calculate subject means
  data_subjMean <- data %>%
    group_by(across(all_of(c(idvar, betweenvars)))) %>%
    summarise(subjMean = mean(.data[[measurevar]], na.rm = na.rm),
              .groups = 'drop')
  
  # Merge the subject means back with the original data
  data <- left_join(data, data_subjMean, by = c(idvar, betweenvars))
  
  # Normalize the data
  measureNormedVar <- paste(measurevar, "norm", sep = "_")
  data[[measureNormedVar]] <- data[[measurevar]] - data$subjMean + 
    mean(data[[measurevar]], na.rm = na.rm)
  
  # Clean up by removing the subjMean column
  data %>%
    select(-subjMean)
}

## Summarizes data, handling within-subjects variables by removing inter-subject variability.
## It will still work if there are no within-S variables.
## Gives count, un-normed mean, normed mean (with same between-group mean),
##   standard deviation, standard error of the mean, and confidence interval.
## If there are within-subject variables, calculate adjusted values using method from Morey (2008).
##   data: a data frame.
##   measurevar: the name of a column that contains the variable to be summariezed
##   betweenvars: a vector containing names of columns that are between-subjects variables
##   withinvars: a vector containing names of columns that are within-subjects variables
##   idvar: the name of a column that identifies each subject (or matched subjects)
##   na.rm: a boolean that indicates whether to ignore NA's
##   conf.interval: the percent range of the confidence interval (default is 95%)
summarySEwithin <- function(data = NULL, measurevar, betweenvars = NULL, withinvars = NULL,
                            idvar = NULL, na.rm = FALSE, conf.interval = .95, .drop = TRUE) {
  
  # Ensure factor variables
  data[c(betweenvars, withinvars)] <- lapply(data[c(betweenvars, withinvars)], factor)
  
  # Compute un-normalized data summary
  datac <- summarySE(data, measurevar, groupvars = c(betweenvars, withinvars),
                     na.rm = na.rm, conf.interval = conf.interval, .drop = .drop)
  
  # Drop columns not needed for normed data summary
  datac <- select(datac, -c(sd, se, ci))
  
  # Normalize data within subjects
  ndata <- normDataWithin(data, idvar, measurevar, betweenvars, na.rm, .drop)
  
  # Name of new normalized variable
  measurevar_n <- paste(measurevar, "norm", sep = "_")
  
  # Compute normalized data summary
  ndatac <- summarySE(ndata, measurevar_n, groupvars = c(betweenvars, withinvars),
                      na.rm = na.rm, conf.interval = conf.interval, .drop = .drop)
  
  # Apply correction factor from Morey (2008) for confidence intervals and standard error
  nWithinGroups <- prod(sapply(ndatac[, withinvars, drop = FALSE], nlevels))
  correctionFactor <- sqrt(nWithinGroups / (nWithinGroups - 1))
  ndatac <- mutate(ndatac,
                   sd = sd * correctionFactor,
                   se = se * correctionFactor,
                   ci = ci * correctionFactor)
  
  # Combine the summaries
  merge(datac, ndatac)
}